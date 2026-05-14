import {
    Handle,
    Position
} from '@xyflow/react';

export default function NotGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <svg width="52" height="50" viewBox="0 0 52 50">
                <path
                    d="M 1 1 L 43 25 L 1 49 Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
                <circle cx={47} cy={25} r={4} fill="white" stroke="black" strokeWidth="2" />
            </svg>

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="in"/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}