import {
    Handle,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/OrGate.svg'

export default function OrGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"OR Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '13%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '13%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}