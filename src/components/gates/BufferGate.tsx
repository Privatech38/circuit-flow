import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/BufferGate.svg?react'
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const BufferGate: CircuitComponent = {
    component: () => (
            <div style={{position: 'relative', lineHeight: 0}}>
                <GateSVG className="component-shape" height={50} />

                {/* Input handles */}
                <Handle type="target" position={Position.Left} id="in"/>

                {/* Output handle */}
                <Handle type="source" position={Position.Right} id="out"/>
            </div>
    ),

    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        setHandleOutputUpdate(node, "out", inputSnapshot.has("in"));
    }

}