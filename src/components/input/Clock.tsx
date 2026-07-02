import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import ClockSVG from '@assets/components/input/Clock.svg';
import type {CircuitComponent, CircuitComponentProps} from "@/components/Component.ts";
import {getNodeOutputState, setHandleOutputUpdate} from "@/simulation/WireManager.ts";
import {intervals} from "@/simulation/EventQueue.ts";

type ClockProps = CircuitComponentProps & {
    frequency: number;
}

export const Clock: CircuitComponent = {
    initialize: (node: Node) => {
        if (!node.type && node.type !== "clock")
            return;
        const data = node.data as ClockProps;
        const frequency = data.frequency || 1; // Default frequency of 1 Hz
        const interval = 1000 / frequency; // Convert frequency to interval in milliseconds
        const intervalID = window.setInterval(() => {
            Clock.evaluate(node);
        }, interval);

        intervals.set(node, intervalID);
    },

    remove: (node: Node) => {
        const intervalID = intervals.get(node);
        if (intervalID) {
            window.clearInterval(intervalID);
            intervals.delete(node);
        }
    },

    evaluate: (node: Node) => {
        // toggle the output state
        const current = getNodeOutputState(node).has("out");
        setHandleOutputUpdate(node, "out", !current);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={ClockSVG} alt={"Clock"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}