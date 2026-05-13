import {
    Handle,
    // type NodeProps,
    // type Node,
    Position
} from '@xyflow/react';

// type AndGateNode = Node<Record<string, never>>;
export default function AndGateNode() {
    return (
        <div style={{position: 'relative'}}>
            <svg width="55" height="50" viewBox="0 0 55 50">
                {/* AND gate shape */}
                <path
                    d="M 1 1 L 30 1 A 24 24 0 0 1 30 49 L 1 49 Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="a" style={{top: '33%'}}/>
            <Handle type="target" position={Position.Left} id="b" style={{top: '67%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="out"/>
        </div>
    );
}