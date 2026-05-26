import {
    Handle,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/NAndGate.svg'

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