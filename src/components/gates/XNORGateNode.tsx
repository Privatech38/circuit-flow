import {
    Handle,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/XNOrGate.svg'

export default function XNORGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"XNOR Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '22%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '22%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}