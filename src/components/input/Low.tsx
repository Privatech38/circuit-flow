import {
    Handle,
    Position
} from '@xyflow/react';
import NodeSVG from '@assets/components/input/Low.svg';

export default function Low() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={NodeSVG} alt={"Low Signal"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}