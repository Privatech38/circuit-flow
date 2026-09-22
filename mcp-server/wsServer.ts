import {randomUUID} from "node:crypto";

const DEFAULT_PORT = 8787;
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

type PendingCall = {
    resolve: (value: unknown) => void;
    reject: (err: Error) => void;
    timer: ReturnType<typeof setTimeout>;
};

type AppSocket = Bun.ServerWebSocket<undefined>;

/*
 * Local-only WS server the circuit-flow browser tab connects out to. Bound to
 * 127.0.0.1 and origin-checked so no other localhost tab/site can attach and
 * issue commands. Tracks a single connected app instance and exposes callApp()
 * as the bridge between MCP tool calls and the live app's WS request/response
 * protocol (see src/bridge/wsClient.ts for the app-side counterpart). Uses
 * Bun's built-in WebSocket server (no `ws` dependency needed).
 */
export class BridgeServer {
    private readonly server: Bun.Server<undefined>;
    private appSocket: AppSocket | null = null;
    private readonly pending = new Map<string, PendingCall>();

    constructor(port = DEFAULT_PORT, allowedOrigins = DEFAULT_ALLOWED_ORIGINS) {
        this.server = Bun.serve({
            hostname: "127.0.0.1",
            port,
            fetch: (req, server) => {
                const origin = req.headers.get("origin");
                if (origin && !allowedOrigins.includes(origin)) {
                    return new Response("Origin not allowed", {status: 403});
                }
                if (server.upgrade(req)) {
                    return;
                }
                return new Response("Upgrade failed", {status: 500});
            },
            websocket: {
                open: (socket) => this.handleOpen(socket as AppSocket),
                message: (_socket, data) => this.handleMessage(data.toString()),
                close: (socket) => this.handleClose(socket as AppSocket),
            },
        });
    }

    private handleOpen(socket: AppSocket) {
        // Single-app model: a new connection (e.g. a page reload) replaces the old one.
        if (this.appSocket && this.appSocket !== socket) {
            this.appSocket.close();
        }
        this.appSocket = socket;
    }

    private handleClose(socket: AppSocket) {
        if (this.appSocket === socket) {
            this.appSocket = null;
            this.rejectAllPending(new Error("circuit-flow app disconnected"));
        }
    }

    private handleMessage(raw: string) {
        let message: {kind?: string; id?: string; ok?: boolean; result?: unknown; error?: {message?: string}};
        try {
            message = JSON.parse(raw);
        } catch {
            return;
        }

        if (message.kind !== "response" || !message.id) return;

        const pending = this.pending.get(message.id);
        if (!pending) return;

        clearTimeout(pending.timer);
        this.pending.delete(message.id);

        if (message.ok) {
            pending.resolve(message.result);
        } else {
            pending.reject(new Error(message.error?.message ?? "Unknown error from circuit-flow app"));
        }
    }

    private rejectAllPending(err: Error) {
        for (const [id, pending] of this.pending) {
            clearTimeout(pending.timer);
            pending.reject(err);
            this.pending.delete(id);
        }
    }

    isAppConnected(): boolean {
        return this.appSocket !== null && this.appSocket.readyState === WebSocket.OPEN;
    }

    callApp(method: string, params?: unknown, timeoutMs = 5000): Promise<unknown> {
        if (!this.isAppConnected()) {
            return Promise.reject(new Error("circuit-flow app is not connected — open it in your browser"));
        }

        const id = randomUUID();
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`Timed out waiting for circuit-flow app to respond to '${method}'`));
            }, timeoutMs);

            this.pending.set(id, {resolve, reject, timer});
            this.appSocket!.send(JSON.stringify({kind: "request", id, method, params}));
        });
    }

    stop() {
        this.server.stop();
    }
}
