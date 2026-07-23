import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import LightSVG from '@assets/components/output/Light.svg';
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";

export const Light: CircuitComponent = {
    evaluate: (node: Node) => {
        if (getHandleState(node, { id: "in" })) {
            node.style = {
                ...node.style,
                fill: '#f00'
            };
        } else {
            node.style = {
                ...node.style,
                fill: '#fff'
            };
        }
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={LightSVG} alt={"Light"} height={50} />

            {/* Input handle */}
            <Handle type="target" position={Position.Left} id="in"/>
        </div>
    )
}