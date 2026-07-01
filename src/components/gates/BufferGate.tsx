import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/BufferGate.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutput} from "@/simulation/WireManager.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";

export const BufferGate: CircuitComponent = {
    component: () => (
            <div style={{position: 'relative', lineHeight: 0}}>
                <img src={GateSVG} alt={"Buffer Gate"} height={50} />

                {/* Input handles */}
                <Handle type="target" position={Position.Left} id="in"/>

                {/* Output handle */}
                <Handle type="source" position={Position.Right} id="out"/>
            </div>
    ),

    evaluate: (node: Node) => {
        setHandleOutput(node, "out", getHandleState(node, { id: "in" }));
    }

}