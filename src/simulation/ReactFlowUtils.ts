import {type Node, type Edge, type ReactFlowInstance, type Handle} from '@xyflow/react'

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
 * @param nodes The array of all nodes.
 */
export function getOutgoingEdges(
    node: Node | { id: string },
    nodes: Node[]
): EdgeNodePair[] {
    if (!node.id) {
        return [];
    }

    return getReactFlowInstance().getEdges().filter((edge) => edge.source === node.id).map((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target);
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