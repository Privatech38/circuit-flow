import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/XNOrGate.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutput} from "@/simulation/WireManager.ts";

export const XNORGate: CircuitComponent = {
    evaluate: (node: Node) => {
        const isAOn = getHandleState(node, { id: "a" });
        const isBOn = getHandleState(node, { id: "b" });

        const output = (isAOn && isBOn) || (!isAOn && !isBOn);
        setHandleOutput(node, "out", output);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"XNOR Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '22%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '22%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}