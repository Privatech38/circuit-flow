import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import ClockSVG from '@assets/components/input/Clock.svg';
import type {CircuitComponent} from "@/components/Component.ts";
import {getNodeOutputState, setHandleOutput} from "@/simulation/WireManager.ts";

export const Clock: CircuitComponent = {
    evaluate: (node: Node) => {
        // toggle the output state
        const current = getNodeOutputState(node).has("out");
        setHandleOutput(node, "out", !current);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={ClockSVG} alt={"Clock"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}