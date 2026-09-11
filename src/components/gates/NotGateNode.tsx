import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/NotGate.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const NotGate: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const inState = inputSnapshot.has("in");
        const output = !inState;
        setHandleOutputUpdate(node, "out", output);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"Not Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="in"/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}