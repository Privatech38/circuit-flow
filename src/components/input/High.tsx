import {
    Handle,
    Position
} from '@xyflow/react';
import NodeSVG from '@assets/components/input/High.svg';

export default function High() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={NodeSVG} alt={"High Signal"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}