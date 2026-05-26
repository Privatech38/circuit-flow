import {
    Handle,
    Position
} from '@xyflow/react';
import andGateSVG from '../../assets/components/gates/AndGate.svg'

export default function AndGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={andGateSVG} alt="AND Gate" width={55} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '70%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}