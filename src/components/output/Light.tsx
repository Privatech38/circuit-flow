import {
    Handle,
    Position,
    type Node,
    type NodeProps
} from '@xyflow/react';
import type {CSSProperties} from 'react';
import LightSVG from '@assets/components/output/Light.svg?react';
import type {CircuitComponent, CircuitComponentData} from "@/components/Component.tsx";

type LightData = CircuitComponentData & {
    color?: string;
}

const DEFAULT_LIGHT_COLOR = "#f00";

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

    component: (props: NodeProps<Node<LightData>>) => {
        const data = props?.data as LightData | undefined;
        const color = data?.color || DEFAULT_LIGHT_COLOR;

        return (
            <div style={{position: 'relative', lineHeight: 0, '--light-color': color} as CSSProperties}>
                <LightSVG className="light-bulb component-stroke" height={30}/>

                {/* Input handle */}
                <Handle type="target" position={Position.Left} id="in"/>
            </div>
        )
    },
}