import type {Node} from "@xyflow/react";
import {logicGates} from "@/components/gates";

/**
 * A map containing node ID - interval ID pairs.
 */
const intervals: Map<string, number> = new Map();

const nodeEvaluators = {
    ...logicGates
}

export function triggerUpdate(node: Node) {
    if (!node.type)
        throw new Error("Type for node is undefined");
    nodeEvaluators[node.type].evaluate(node);
}