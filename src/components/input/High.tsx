import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import NodeSVG from '@assets/components/input/High.svg?react';
import type {InputCircuitComponent} from "@/components/Component.tsx";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const High: InputCircuitComponent = {
    initialize: (node: Node) => {
        High.evaluate(node);
    },

    evaluate: (node: Node) => {
        setHandleOutputUpdate(node, "out", true);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <NodeSVG className="component-shape" height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}