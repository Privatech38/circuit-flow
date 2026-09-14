import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/XNOrGate.svg?react'
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const XNORGate: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const isAOn = inputSnapshot.has("a");
        const isBOn = inputSnapshot.has("b");

        const output = (isAOn && isBOn) || (!isAOn && !isBOn);
        setHandleOutputUpdate(node, "out", output);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <GateSVG className="component-shape" height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '22%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '22%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}