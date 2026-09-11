import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import andGateSVG from '../../assets/components/gates/AndGate.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const ANDGate: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const isAOn = inputSnapshot.has("a");
        const isBOn = inputSnapshot.has("b");

        const output = isAOn && isBOn;

        setHandleOutputUpdate(node, "out", output);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={andGateSVG} alt="AND Gate" height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '70%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    )
}