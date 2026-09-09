import {getSimulationNodes} from "@/simulation/ReactFlowUtils.ts";
import {inputTypes} from "@/components/input";
import type {Node} from "@xyflow/react";
import {EventQueue} from "@/simulation/EventQueue.ts";
import {componentRegistry, type ComponentType} from "@/components/ComponentRegistry.ts";
import {clockUpdateBus} from "@/components/input/Clock.tsx";
import {EventEmitter} from "eventemitter3";
import type {CircuitComponent} from "@/components/Component.ts";
import {clearEdgeStyles, clearNodeOutputStates} from "@/simulation/WireManager.ts";

type SimulationState = 'running' | 'paused' | 'stopped';

let simulationState: SimulationState = 'stopped';

export const simulationStateBus = new EventEmitter();

export function getSimulationState(): SimulationState {
    return simulationState;
}

function setSimulationState(state: SimulationState) {
    simulationState = state;
    simulationStateBus.emit('change');
}

/**
 * Subscribes to simulation state changes. Intended for use with useSyncExternalStore.
 * Returns an unsubscribe function.
 */
export function subscribeToSimulationState(callback: () => void): () => void {
    simulationStateBus.on('change', callback);
    return () => simulationStateBus.off('change', callback);
}

/**
 * Returns a list of all input nodes in the current React Flow instance.
 */
function getInputNodes(): Node[] {
    return getSimulationNodes().filter(node => node.type && node.type in inputTypes);
}

clockUpdateBus.on('stateChange', () => {
    stepSimulation();
})

export function startSimulation() {
    setSimulationState('running');
    applyOnAllNodes((component, node) => {
        if (component.initialize)
            component.initialize(node);
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
    applyOnAllNodes((component, node) => {
        if (component.stop)
            component.stop(node);
    });
    EventQueue.clear();
    clearNodeOutputStates();
    clearEdgeStyles();
    setSimulationState('stopped');
}

export function pauseSimulation() {
    setSimulationState('paused');
    applyOnAllNodes((component, node) => {
        if (component.pause)
            component.pause(node);
    });
}

export function resumeSimulation() {
    setSimulationState('running');
    applyOnAllNodes((component, node) => {
        if (component.resume)
            component.resume(node);
    });

    stepSimulation();
}

function applyOnAllNodes(callback: (component: CircuitComponent, node: Node) => void) {
    getSimulationNodes().forEach(node => {
        if (!node.type)
            return;
        const component = componentRegistry[node.type as ComponentType];
        callback(component, node);
    });
}