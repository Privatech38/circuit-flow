import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import LightSVG from '@assets/components/output/Light.svg?react';
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";

export const Light: CircuitComponent = {
    evaluate: (node: Node) => {
        const isOn = getHandleState(node);
        const bulb = document.querySelector(`.react-flow__node[data-id="${node.id}"] .light-bulb`);
        bulb?.classList.toggle('signal-high', isOn);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <LightSVG className="light-bulb" height={50}/>

            {/* Input handle */}
            <Handle type="target" position={Position.Left} id="in"/>
        </div>
    )
}