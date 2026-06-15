import { useState, useCallback } from 'react'
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
    type Node, Controls, MiniMap, Background, BackgroundVariant, type DefaultEdgeOptions, ConnectionLineType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {LogicGate, logicGateTypes} from "@/components/gates";
import {Input, inputTypes} from "@/components/input";
import {Output, outputTypes} from "@/components/output";
// import './App.css'

const nodeTypes = {
    ...logicGateTypes,
    ...inputTypes,
    ...outputTypes,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
    type: ConnectionLineType.SmoothStep,
}

const initialNodes: Node[] = [
    { id: 'clock1', type: Input.CLOCK, position: { x: 0, y: 0 }, data: {} },
    { id: 'high1', type: Input.HIGH, position: { x: 0, y: 100 }, data: {} },
    { id: 'gate1', type: LogicGate.AND, position: { x: 150, y: 50 }, data: {} },
    { id: 'light1', type: Output.LIGHT, position: { x: 300, y: 50 }, data: {} },
];

const initialEdges: Edge[] = [
    { id: 'clock1-gate1', source: 'clock1', target: 'gate1', type: ConnectionLineType.SmoothStep },
    { id: 'high1-gate1', source: 'high1', target: 'gate1', targetHandle: 'b', type: ConnectionLineType.SmoothStep },
    { id: 'gate1-light1', source: 'gate1', target: 'light1', type: ConnectionLineType.SmoothStep },
];

function EditorTab() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [setNodes],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange<Edge>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [setEdges],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [setEdges],
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.SmoothStep}
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );}

export default EditorTab