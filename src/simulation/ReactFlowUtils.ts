import {type Edge, type Handle, type Node} from '@xyflow/react'
import {getWireState} from "@/simulation/WireManager.ts";

/*
 * React Flow's internal store only syncs with the controlled `nodes`/`edges` props via a
 * useEffect, which runs *after* the change handler that triggered it has already returned.
 * That means an edge/node added via onNodesChange/onEdgesChange is not yet visible through
 * `getReactFlowInstance().getNodes()/getEdges()` while the simulation is stepped synchronously
 * inside that same handler. These two arrays are the simulation's own up-to-date view of the
 * graph; EditorTab keeps them in sync explicitly whenever it computes a new nodes/edges array.
 */
let simulationNodes: Node[] = [];
let simulationEdges: Edge[] = [];

export function syncSimulationNodes(nodes: Node[]) {
    simulationNodes = nodes;
}

export function syncSimulationEdges(edges: Edge[]) {
    simulationEdges = edges;
}

export function getSimulationNodes(): Node[] {
    return simulationNodes;
}

export function getSimulationEdges(): Edge[] {
    return simulationEdges;
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

    let edges = simulationEdges.filter((edge) => edge.source === node.id);

    if (handleId)
        edges = edges.filter(edge => edge.sourceHandle === handleId);

    return edges.map((edge) => {
        const targetNode = simulationNodes.find((n) => n.id === edge.target);
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

    let filteredEdges = simulationEdges;
    if (handle && handle.id) {
        filteredEdges = filteredEdges.filter((edge) => edge.targetHandle === handle.id);
    }

    return filteredEdges.filter((edge) => edge.target === node.id);
}

export function getTargetHandles(node: Node | { id: string }): string[] {
    if (!node.id) {
        return [];
    }

    return simulationEdges.filter((edge) => edge.target === node.id && edge.targetHandle)
        .map(edge => edge.targetHandle!);
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

    let filteredEdges = simulationEdges.filter((edge) => edge.target === node.id);
    if (handle && handle.id) {
        filteredEdges = filteredEdges.filter((edge) => edge.targetHandle === handle.id);
    }

    return filteredEdges.map(edge => getWireState({ id: edge.source}, edge.sourceHandle)).includes(true);
}