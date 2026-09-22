import {EventEmitter} from "eventemitter3";
import type {Connection, Edge, Node, XYPosition} from "@xyflow/react";

/*
 * Nodes/edges live in EditorTab's local React state, so there is no module-level
 * setter to call the way SimulationManager calls into the simulation directly.
 * This bus lets external callers (the MCP bridge's WS client) request a mutation;
 * EditorTab is the sole subscriber and performs the actual state update, then
 * resolves/rejects the promise the caller is awaiting.
 */
export const graphCommandBus = new EventEmitter();

export type AddNodeParams = { type: string; position: XYPosition; data?: Record<string, unknown> };
export type MoveNodeParams = { nodeId: string; position: XYPosition };

function request<TParams, TResult>(event: string, params: TParams): Promise<TResult> {
    return new Promise((resolve, reject) => {
        graphCommandBus.emit(event, params, resolve, reject);
    });
}

export function requestAddConnection(connection: Connection): Promise<Edge> {
    return request("addConnection", connection);
}

export function requestRemoveConnection(edgeId: string): Promise<boolean> {
    return request("removeConnection", edgeId);
}

export function requestAddNode(params: AddNodeParams): Promise<Node> {
    return request("addNode", params);
}

export function requestMoveNode(params: MoveNodeParams): Promise<Node> {
    return request("moveNode", params);
}

export function requestRemoveNode(nodeId: string): Promise<boolean> {
    return request("removeNode", nodeId);
}
