import type {Node} from "@xyflow/react";
import {logicGates} from "@/components/gates";
import {outputComponents} from "@/components/output";
import {inputComponents} from "@/components/input";

/**
 * A map containing node ID - interval ID pairs.
 */
const intervals: Map<string, number> = new Map();

const nodeEvaluators = {
    ...logicGates,
    ...inputComponents,
    ...outputComponents,
}

type NodeType = keyof typeof nodeEvaluators;

/**
 * Triggers an update on the specified node.
 * @param node
 */
export function triggerUpdate(node: Node) {
    if (!node.type)
        throw new Error("Type for node is undefined");
    if (node.type in nodeEvaluators) {
        const evaluator = nodeEvaluators[node.type as NodeType];
        evaluator.evaluate(node);
    }
}