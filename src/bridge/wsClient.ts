import {
    getSimulationState,
    pauseSimulation,
    resumeSimulation,
    simulationStateBus,
    startSimulation,
    stopSimulation,
} from "@/simulation/SimulationManager.ts";
import {getSimulationEdges, getSimulationNodes, graphBus} from "@/simulation/ReactFlowUtils.ts";
import {
    requestAddConnection,
    requestAddNode,
    requestMoveNode,
    requestRemoveConnection,
    requestRemoveNode,
    type AddNodeParams,
    type MoveNodeParams,
} from "@/simulation/GraphController.ts";
import {componentRegistry} from "@/components/ComponentRegistry.ts";
import type {Connection} from "@xyflow/react";

/*
 * Optional local dev bridge: connects out to a local MCP bridge process (see
 * mcp-server/) so an MCP client (e.g. Claude Desktop/Code) can drive this running
 * app instance. Entirely opt-in — if nothing is listening on the port, this just
 * quietly retries in the background and never affects normal app usage.
 */

type BridgeRequest = { kind: "request"; id: string; method: string; params?: unknown };
type AppMessage =
    | { kind: "hello"; role: "app"; version: string }
    | { kind: "response"; id: string; ok: true; result: unknown }
    | { kind: "response"; id: string; ok: false; error: { message: string } }
    | { kind: "event"; event: string; payload: unknown };

const APP_VERSION = "1.0.0";
const RECONNECT_MIN_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 10000;

type MethodHandler = (params: unknown) => Promise<unknown>;

const methodHandlers: Record<string, MethodHandler> = {
    "simulation.start": async () => {
        startSimulation();
        return {state: getSimulationState()};
    },
    "simulation.stop": async () => {
        stopSimulation();
        return {state: getSimulationState()};
    },
    "simulation.pause": async () => {
        pauseSimulation();
        return {state: getSimulationState()};
    },
    "simulation.resume": async () => {
        resumeSimulation();
        return {state: getSimulationState()};
    },
    "simulation.getState": async () => ({state: getSimulationState()}),
    "graph.getSnapshot": async () => ({nodes: getSimulationNodes(), edges: getSimulationEdges()}),
    "graph.addConnection": async (params) => ({edge: await requestAddConnection(params as Connection)}),
    "graph.removeConnection": async (params) => ({
        removed: await requestRemoveConnection((params as { edgeId: string }).edgeId),
    }),
    "node.add": async (params) => ({node: await requestAddNode(params as AddNodeParams)}),
    "node.move": async (params) => ({node: await requestMoveNode(params as MoveNodeParams)}),
    "node.remove": async (params) => ({removed: await requestRemoveNode((params as { nodeId: string }).nodeId)}),
    "component.listTypes": async () => ({types: Object.keys(componentRegistry)}),
};

function resolveBridgeUrl(): string {
    const port = Number(import.meta.env.VITE_MCP_BRIDGE_PORT) || 8787;
    return `ws://localhost:${port}`;
}

export function startMcpBridgeClient(): () => void {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectDelay = RECONNECT_MIN_DELAY_MS;
    let stopped = false;

    const send = (message: AppMessage) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    const onSimulationStateChanged = () => {
        send({kind: "event", event: "simulation.stateChanged", payload: {state: getSimulationState()}});
    };

    const onGraphChanged = (payload: unknown) => {
        send({kind: "event", event: "graph.changed", payload});
    };

    const handleRequest = async ({id, method, params}: BridgeRequest) => {
        const handler = methodHandlers[method];
        if (!handler) {
            send({kind: "response", id, ok: false, error: {message: `Unknown method: ${method}`}});
            return;
        }
        try {
            const result = await handler(params);
            send({kind: "response", id, ok: true, result});
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            send({kind: "response", id, ok: false, error: {message}});
        }
    };

    const connect = () => {
        if (stopped) return;

        socket = new WebSocket(resolveBridgeUrl());

        socket.addEventListener("open", () => {
            reconnectDelay = RECONNECT_MIN_DELAY_MS;
            send({kind: "hello", role: "app", version: APP_VERSION});
        });

        socket.addEventListener("message", (event) => {
            let message: BridgeRequest;
            try {
                message = JSON.parse(event.data);
            } catch {
                return;
            }
            if (message.kind === "request") {
                void handleRequest(message);
            }
        });

        const scheduleReconnect = () => {
            if (stopped || reconnectTimer) return;
            reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                reconnectDelay = Math.min(reconnectDelay * 2, RECONNECT_MAX_DELAY_MS);
                connect();
            }, reconnectDelay);
        };

        socket.addEventListener("close", scheduleReconnect);
        socket.addEventListener("error", () => socket?.close());
    };

    connect();
    simulationStateBus.on("change", onSimulationStateChanged);
    graphBus.on("changed", onGraphChanged);

    return () => {
        stopped = true;
        simulationStateBus.off("change", onSimulationStateChanged);
        graphBus.off("changed", onGraphChanged);
        if (reconnectTimer) clearTimeout(reconnectTimer);
        socket?.close();
    };
}
