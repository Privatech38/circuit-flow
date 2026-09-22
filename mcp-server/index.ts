import {BridgeServer} from "./wsServer.ts";
import {startMcpServer} from "./mcpServer.ts";

const port = Number(process.env.MCP_BRIDGE_PORT) || 8787;
const allowedOrigins = process.env.MCP_BRIDGE_ALLOWED_ORIGINS?.split(",").map((o) => o.trim());

const bridge = new BridgeServer(port, allowedOrigins);

// All MCP protocol traffic goes over stdio; stderr is safe for our own logging.
console.error(`[circuit-flow-mcp] WS bridge listening on 127.0.0.1:${port}`);

await startMcpServer(bridge);
