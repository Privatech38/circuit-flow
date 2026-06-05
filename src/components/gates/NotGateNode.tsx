import {
    Handle,
    Position
} from '@xyflow/react';
import GateSVG from '../../assets/components/gates/NotGate.svg'

export default function NotGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={GateSVG} alt={"Not Gate"} height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="in"/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}