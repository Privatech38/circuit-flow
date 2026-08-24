import {getReactFlowInstance} from "@/simulation/ReactFlowUtils.ts";
import {inputTypes} from "@/components/input";
import type {Node} from "@xyflow/react";
import {EventQueue} from "@/simulation/EventQueue.ts";
import {componentRegistry, type ComponentType} from "@/components/ComponentRegistry.ts";
import {clockUpdateBus} from "@/components/input/Clock.tsx";

/**
 * Returns a list of all input nodes in the current React Flow instance.
 */
function getInputNodes(): Node[] {
    return getReactFlowInstance().getNodes().filter(node => node.type && node.type in inputTypes);
}

clockUpdateBus.on('stateChange', () => {
    stepSimulation();
})

export function startSimulation() {

    getReactFlowInstance().getNodes().forEach(node => {
        if (!node.type)
            return;
        const evaluator = componentRegistry[node.type as ComponentType];
        if (evaluator.initialize)
            evaluator.initialize(node);
    });

    const inputNodes = getInputNodes();
    inputNodes.forEach(node => EventQueue.enqueue(node));

    stepSimulation();
}

export function stepSimulation() {
    const node = EventQueue.dequeue();

    if (!node || !node.type)
        return;

    const evaluator = componentRegistry[node.type as ComponentType];
    if (evaluator.evaluate)
        evaluator.evaluate(node);

    if (EventQueue.size > 0)
        stepSimulation();
}

export function stopSimulation() {
    EventQueue.clear();

}