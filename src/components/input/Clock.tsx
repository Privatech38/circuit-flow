import {Handle, type Node, Position} from '@xyflow/react';
import ClockSVG from '@assets/components/input/Clock.svg';
import type {CircuitComponent, CircuitComponentProps} from "@/components/Component.ts";
import {getNodeOutputState, setHandleOutputUpdate} from "@/simulation/WireManager.ts";
import {EventEmitter} from "eventemitter3";

export const clockUpdateBus = new EventEmitter();
type ClockProps = CircuitComponentProps & {
    frequency: number;
}

type ClockState = {
    intervalID?: number;
    startTime?: number;
    pausedTime?: number;
};

/**
 * A map containing node ID - clock state pairs.
 * Keyed by node ID rather than the Node object itself, since React Flow
 * replaces a node's object reference whenever its data/position changes.
 */
const clockStates: Map<string, ClockState> = new Map();

function getClockState(id: string): ClockState {
    let state = clockStates.get(id);
    if (!state) {
        state = {};
        clockStates.set(id, state);
    }
    return state;
}

export const Clock: CircuitComponent = {
    initialize: (node: Node) => {
        if (!node.type && node.type !== "clock")
            return;
        const data = node.data as ClockProps;
        const frequency = data.frequency || 1; // Default frequency of 1 Hz
        const interval = 1000 / frequency; // Convert frequency to interval in milliseconds
        getClockState(node.id).intervalID = window.setInterval(() => {
            Clock.evaluate(node);
        }, interval);
    },

    remove: (node: Node) => {
        const state = clockStates.get(node.id);
        if (state?.intervalID) {
            window.clearInterval(state.intervalID);
        }
        clockStates.delete(node.id);
    },

    stop: (node: Node) => {
        Clock.remove!(node);
    },

    pause: (node: Node) => {
        const state = getClockState(node.id);
        state.pausedTime = Date.now() - (state.startTime || 0);
        if (state.intervalID) {
            window.clearInterval(state.intervalID);
            state.intervalID = undefined;
        }
    },

    resume: (node: Node) => {
        if (!node.type && node.type !== "clock")
            return;
        const data = node.data as ClockProps;
        const frequency = data.frequency || 1;
        const interval = 1000 / frequency;
        const passedTime = clockStates.get(node.id)?.pausedTime || Number.MAX_SAFE_INTEGER;
        const startDelay = Math.max(interval - passedTime, 0);
        window.setTimeout(() => {
            Clock.evaluate(node);
            Clock.initialize!(node);
        }, startDelay);
    },

    evaluate: (node: Node) => {
        getClockState(node.id).startTime = Date.now();
        const current = getNodeOutputState(node).has("out");
        setHandleOutputUpdate(node, "out", !current);
        clockUpdateBus.emit('stateChange');
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={ClockSVG} alt={"Clock"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}
