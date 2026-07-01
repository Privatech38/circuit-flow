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
        // read input state so that event system can access it; visual update should be handled elsewhere
        getHandleState(node, { id: "in" });
        // no outputs to set
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={LightSVG} alt={"Light"} height={50} />

            {/* Input handle */}
            <Handle type="target" position={Position.Left} id="in"/>
        </div>
    )
}