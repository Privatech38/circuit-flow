import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import NodeSVG from '@assets/components/input/Low.svg';
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutput} from "@/simulation/WireManager.ts";

export const Low: CircuitComponent = {
    evaluate: (node: Node) => {
        setHandleOutput(node, "out", false);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={NodeSVG} alt={"Low Signal"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}