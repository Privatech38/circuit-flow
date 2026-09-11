import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import LightSVG from '@assets/components/output/Light.svg?react';
import type {CircuitComponent} from "@/components/Component.ts";

export const Light: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const isOn = inputSnapshot.has("in");
        const bulb = document.querySelector(`.react-flow__node[data-id="${node.id}"] .light-bulb`);
        bulb?.classList.toggle('signal-high', isOn);
    },

    stop: (node: Node) => {
        const bulb = document.querySelector(`.react-flow__node[data-id="${node.id}"] .light-bulb`);
        bulb?.classList.remove('signal-high');
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <LightSVG className="light-bulb component-stroke" height={50}/>

            {/* Input handle */}
            <Handle type="target" position={Position.Left} id="in"/>
        </div>
    )
}