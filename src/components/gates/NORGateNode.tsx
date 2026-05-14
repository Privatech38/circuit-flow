import {
    Handle,
    Position
} from '@xyflow/react';

export default function NOrGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <svg width="63" height="50" viewBox="0 0 63 50">
                <path
                    d="M 1 1 L 15 1 C 30 1 45 10 54 25 C 45 40 30 49 15 49 L 1 49 A 60 50 0 0 0 1 1 Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
                <circle cx={58} cy={25} r={4} fill="white" stroke="black" strokeWidth="2" />
            </svg>

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%', left: '13%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%', left: '13%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}