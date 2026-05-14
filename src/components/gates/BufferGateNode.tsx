import {
    Handle,
    Position
} from '@xyflow/react';

export default function BufferGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <svg width="44" height="50" viewBox="0 0 44 50">
                <path
                    d="M 1 1 L 43 25 L 1 49 Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="in"/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}