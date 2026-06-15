import {
    Handle,
    Position
} from '@xyflow/react';
import LightSVG from '@assets/components/output/Light.svg';

export default function Light() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={LightSVG} alt={"Light"} height={50} />

            {/* Input handle */}
            <Handle type="target" position={Position.Left} id="in"/>
        </div>
    );
}