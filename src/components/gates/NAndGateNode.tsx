import {
    Handle,
    Position
} from '@xyflow/react';

export default function NAndGateNode() {
    return (
        <div style={{position: 'relative', lineHeight: 0}}>
            <svg width="63" height="50" viewBox="0 0 63 50">
                <path
                    d="M 1 1 L 30 1 A 24 24 0 0 1 30 49 L 1 49 Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
                <circle cx={58} cy={25} r={4} fill="white" stroke="black" strokeWidth="2" />
            </svg>

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '70%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}