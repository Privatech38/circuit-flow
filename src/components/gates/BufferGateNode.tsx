import {
    Handle,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/BufferGate.svg'

export default function BufferGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"Buffer Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="in"/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}