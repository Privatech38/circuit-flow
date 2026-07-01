import {type Node, type Edge, type ReactFlowInstance, type Handle} from '@xyflow/react'
import {WireState} from "@/simulation/WireManager.ts";

let reactFlow: ReactFlowInstance | null = null;

export function setReactFlowInstance(instance: ReactFlowInstance) {
    reactFlow = instance;
}

export function getReactFlowInstance(): ReactFlowInstance {
    if (!reactFlow) {
        throw new Error('ReactFlow instance accessed before initialization');
    }
    return reactFlow;
}

export interface EdgeNodePair {
    edge: Edge,
    node: Node,
}

/**
 * Returns a list of outgoing edges-node pairs.
 * @param node The node to get the connected nodes from.
 * @param handleId Optional parameter for the handle ID for which to filter by.
 */
export function getOutgoingEdges(
    node: Node | { id: string },
    handleId: string | null = null
): EdgeNodePair[] {
    if (!node.id) {
        return [];
    }

    let edges = getReactFlowInstance().getEdges().filter((edge) => edge.source === node.id);

    if (handleId)
        edges = edges.filter(edge => edge.sourceHandle === handleId);

    return edges.map((edge) => {
        const targetNode = getReactFlowInstance().getNodes().find((n) => n.id === edge.target);
        return {
            edge: edge,
            node: targetNode!
        }
    });
}

/**
 * Returns a list of incoming edges or just the ones to the handle if provided.
 * @param node The node to get the edges for.
 * @param handle The specific handle to filter by or null if all edges should be used.
 */
export function getIncomingEdges(
    node: Node | { id: string },
    handle: Handle | { id: string } | null = null
): Edge[] {
    if (!node.id) {
        return [];
    }

    let filteredEdges = getReactFlowInstance().getEdges();
    if (handle && handle.id) {
        filteredEdges = filteredEdges.filter((edge) => edge.targetHandle === handle.id);
    }

    return filteredEdges.filter((edge) => edge.target === node.id);
}

/**
 * Returns the handle state if any of the input wires are on HIGH signal.
 * @param node The node to check.
 * @param handle The handle to get state for.
 */
export function getHandleState(
    node: Node | { id: string },
    handle: Handle | { id: string } | null = null
): true | false {
    if (!node.id) {
        return false;
    }

    let filteredEdges = getReactFlowInstance().getEdges();
    if (handle && handle.id) {
        filteredEdges = filteredEdges.filter((edge) => edge.targetHandle === handle.id);
    }

    return filteredEdges.filter((edge) => edge.target === node.id)
        .map(edge => WireState.get(edge.id)).includes(true);
}