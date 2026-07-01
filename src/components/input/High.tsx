import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import NodeSVG from '@assets/components/input/High.svg';
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutput} from "@/simulation/WireManager.ts";

export const High: CircuitComponent = {
    evaluate: (node: Node) => {
        setHandleOutput(node, "out", true);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={NodeSVG} alt={"High Signal"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}