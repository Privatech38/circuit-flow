import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/NAndGate.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {JSX} from "react/jsx-runtime";

export const NANDGate: CircuitComponent = {
    component(): JSX.Element {
        return (
            <div style={{position: 'relative', lineHeight: 0}}>
                <img src={GateSVG} alt={"NAND Gate"} height={50} />

                {/* Input handles */}
                <Handle type="target" position={Position.Left} id="a" style={{top: '30%'}}/>
                <Handle type="target" position={Position.Left} id="b" style={{top: '70%'}}/>

                {/* Output handle */}
                <Handle type="source" position={Position.Right} id="out"/>
            </div>
        );
    },

    evaluate(node: Node): void {

    }

}

export default function NAndGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"NAND Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '70%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}