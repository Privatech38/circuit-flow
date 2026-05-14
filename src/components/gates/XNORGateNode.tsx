import {
    Handle,
    Position
} from '@xyflow/react';

export default function XNORGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <svg width="68" height="50" viewBox="0 0 68 50">
                <path
                    d="M 6 1 L 20 1 C 35 1 50 10 59 25 C 50 40 35 49 20 49 L 6 49 A 60 50 0 0 0 6 1 Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
                <path
                    d="M 1 49 A 60 50 0 0 0 1 1"
                    fill="transparent"
                    stroke="black"
                    strokeWidth="2"
                />
                <circle cx={63} cy={25} r={4} fill="white" stroke="black" strokeWidth="2" />
            </svg>

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '22%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '22%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}