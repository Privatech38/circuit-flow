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
    type Node, Controls, MiniMap, Background, BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {logicGateTypes} from "../components";
// import './App.css'

const initialNodes: Node[] = [
    { id: 'n1', type: 'nandGate', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', type: 'orGate', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    { id: 'n3', type: 'xorGate', position: { x: 100, y: 100 }, data: { label: 'Node 3' } },
    { id: 'n4', type: 'norGate', position: { x: 200, y: 100 }, data: { label: 'Node 4' } },
    { id: 'n5', type: 'xnorGate', position: { x: 200, y: 0 }, data: { label: 'Node 5' } },
    { id: 'n6', type: 'bufferGate', position: { x: 200, y: 200 }, data: {} },
    { id: 'n7', type: 'notGate', position: { x: 0, y: 200 }, data: {} },
];
const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2', type: 'step' }];

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
                nodeTypes={logicGateTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );}

export default EditorTab