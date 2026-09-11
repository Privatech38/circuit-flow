import {
    Handle,
    Position,
    type Node
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/XOrGate.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const XOrGate: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const isAOn = inputSnapshot.has("a");
        const isBOn = inputSnapshot.has("b");

        const output = (isAOn && !isBOn) || (!isAOn && isBOn);
        setHandleOutputUpdate(node, "out", output);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"XOR Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '22%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '22%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}