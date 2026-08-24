import type {Edge, Node} from "@xyflow/react";
import {getOutgoingEdges} from "@/simulation/ReactFlowUtils.ts";
import {EventQueue} from "@/simulation/EventQueue.ts";

/**
 * A map containing all wires' current states.
 */
export const WireState: Map<string, boolean> = new Map();

/**
 * A map containing sets of active handle outputs for nodes.
 */
const NodeOutputState: Map<string, Set<string>> = new Map();

/**
 * Returns the state of a wire
 * @param node
 * @param handleID
 */
export function getWireState(node: Node | { id: string }, handleID: string | null | undefined) {
    const nodeState = NodeOutputState.get(node.id);
    if (!nodeState) {
        return false;
    }

    if (!handleID) {
        return nodeState.size > 0;
    }

    return nodeState.has(handleID);
}

/**
 * Returns a set of all active output handle IDs for the specified Node.
 * @param node the node.
 */
export function getNodeOutputState(node: Node | { id: string }): Set<string> {
    if (!node.id) {
        throw new Error("Node was not found");
    }

    if (!NodeOutputState.has(node.id)) {
        const freshSet = new Set<string>();
        NodeOutputState.set(node.id, freshSet);
        return freshSet;
    }

    return NodeOutputState.get(node.id)!;
}

/**
 * Sets the specified handle's output to the provided state.
 * @param node The node.
 * @param handleId The handle ID.
 * @param state The state where `true` is HIGH signal and `false` is LOW signal.
 */
export function setHandleOutput(node: Node | { id: string }, handleId: string, state: boolean): boolean {
    if (!node.id)
        return false;

    const nodeOutputState = getNodeOutputState(node);
    const handleState = nodeOutputState.has(handleId);

    // If nothing has changed, return
    if (handleState == state)
        return false;

    if (state)
        nodeOutputState.add(handleId);
    else
        nodeOutputState.delete(handleId);

    return true;
}

/**
 * Sets the specified handle's output to the provided state and update outgoing edges and nodes if the state has changed.
 * @param node The node.
 * @param handleId The handle ID.
 * @param state The state where `true` is HIGH signal and `false` is LOW signal.
 */
export function setHandleOutputUpdate(node: Node, handleId: string, state: boolean): void {
    if (!setHandleOutput(node, handleId, state))
        return;
    for (const outgoingEdge of getOutgoingEdges(node, handleId)) {
        EventQueue.enqueue(outgoingEdge.node);
        updateEdgeStyle(outgoingEdge.edge, state);
    }
}

export function updateEdgeStyle(edge: Edge | { id: string }, state: boolean) {
    if (state) {
        const el = document.querySelector(`[data-id="${edge.id}"] path`);
        el?.classList.toggle('signal-high', state);
    } else {
        const el = document.querySelector(`[data-id="${edge.id}"] path`);
        el?.classList.toggle('signal-high', state);
    }
}