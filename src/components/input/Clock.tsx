import {
    Handle,
    Position
} from '@xyflow/react';
import ClockSVG from '@assets/components/input/Clock.svg';

export default function Clock() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={ClockSVG} alt={"Clock"} height={50} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}