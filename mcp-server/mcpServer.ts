import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import type {BridgeServer} from "./wsServer.ts";
import type {CallToolResult} from "@modelcontextprotocol/sdk/types.js";

const positionSchema = {
    x: z.number(),
    y: z.number(),
};

async function callTool(bridge: BridgeServer, method: string, params?: unknown): Promise<CallToolResult> {
    try {
        const result = await bridge.callApp(method, params);
        return {content: [{type: "text", text: JSON.stringify(result ?? {})}]};
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {content: [{type: "text", text: message}], isError: true};
    }
}

export function createMcpServer(bridge: BridgeServer): McpServer {
    const server = new McpServer({name: "circuit-flow", version: "1.0.0"});

    server.registerTool(
        "startSimulation",
        {description: "Start the circuit simulation."},
        () => callTool(bridge, "simulation.start"),
    );
    server.registerTool(
        "stopSimulation",
        {description: "Stop the circuit simulation."},
        () => callTool(bridge, "simulation.stop"),
    );
    server.registerTool(
        "pauseSimulation",
        {description: "Pause the running circuit simulation."},
        () => callTool(bridge, "simulation.pause"),
    );
    server.registerTool(
        "resumeSimulation",
        {description: "Resume a paused circuit simulation."},
        () => callTool(bridge, "simulation.resume"),
    );
    server.registerTool(
        "getSimulationState",
        {description: "Get the current simulation state (running/paused/stopped)."},
        () => callTool(bridge, "simulation.getState"),
    );
    server.registerTool(
        "getCircuitSnapshot",
        {description: "Read the current circuit: all nodes and their connections (edges)."},
        () => callTool(bridge, "graph.getSnapshot"),
    );
    server.registerTool(
        "addNode",
        {
            description: "Add a new component node to the circuit canvas.",
            inputSchema: {
                type: z.string().describe("Component type; see the circuit-flow://component-types resource for valid values"),
                position: z.object(positionSchema),
                data: z.record(z.string(), z.unknown()).optional(),
            },
        },
        (params) => callTool(bridge, "node.add", params),
    );
    server.registerTool(
        "moveNode",
        {
            description: "Move an existing node to a new canvas position.",
            inputSchema: {
                nodeId: z.string(),
                position: z.object(positionSchema),
            },
        },
        (params) => callTool(bridge, "node.move", params),
    );
    server.registerTool(
        "removeNode",
        {
            description: "Remove a node (and any connections attached to it) from the circuit.",
            inputSchema: {nodeId: z.string()},
        },
        (params) => callTool(bridge, "node.remove", params),
    );
    server.registerTool(
        "addConnection",
        {
            description: "Connect an output handle of one node to an input handle of another.",
            inputSchema: {
                source: z.string().describe("Source node id"),
                sourceHandle: z.string().optional(),
                target: z.string().describe("Target node id"),
                targetHandle: z.string().optional(),
            },
        },
        (params) => callTool(bridge, "graph.addConnection", params),
    );
    server.registerTool(
        "removeConnection",
        {
            description: "Remove a wire connection by its edge id.",
            inputSchema: {edgeId: z.string()},
        },
        (params) => callTool(bridge, "graph.removeConnection", params),
    );

    server.registerResource(
        "component-types",
        "circuit-flow://component-types",
        {
            title: "Circuit component types",
            description: "Component type strings valid for the addNode tool's `type` parameter (e.g. 'switch', 'andGate', 'encoder'). Fixed by the app build, so this never changes at runtime.",
            mimeType: "application/json",
        },
        async (uri) => {
            const {types} = await bridge.callApp("component.listTypes") as {types: string[]};
            return {
                contents: [{
                    uri: uri.href,
                    mimeType: "application/json",
                    text: JSON.stringify(types),
                }],
            };
        },
    );

    return server;
}

export async function startMcpServer(bridge: BridgeServer): Promise<void> {
    const server = createMcpServer(bridge);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
