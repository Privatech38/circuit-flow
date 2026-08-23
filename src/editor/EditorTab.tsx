import {useState, useCallback} from 'react'
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
    type Node, Controls, MiniMap, Background, BackgroundVariant, type DefaultEdgeOptions, ConnectionLineType,
    useReactFlow
} from '@xyflow/react';
import { getEdgeId } from '@xyflow/system';
import '@xyflow/react/dist/style.css';
import {LogicGate, logicGateTypes} from "@/components/gates";
import {Input, inputTypes} from "@/components/input";
import {Output, outputTypes} from "@/components/output";
import {setReactFlowInstance} from "@/simulation/ReactFlowUtils.ts";
import {getNodeOutputState, updateEdgeStyle} from "@/simulation/WireManager.ts";
import {componentRegistry, type ComponentType} from "@/components/ComponentRegistry.ts";
import {PoweredEdge} from "@/editor/PoweredEdge.tsx";
// import './App.css'

const nodeTypes = {
    ...logicGateTypes,
    ...inputTypes,
    ...outputTypes,
}

const edgeTypes = {
    'powered-edge': PoweredEdge
}

const defaultEdgeOptions: DefaultEdgeOptions = {
    type: 'powered-edge',
}

const initialNodes: Node[] = [
    { id: 'clock1', type: Input.CLOCK, position: { x: 0, y: 0 }, data: {} },
    { id: 'high1', type: Input.HIGH, position: { x: 0, y: 100 }, data: {} },
    { id: 'gate1', type: LogicGate.AND, position: { x: 150, y: 50 }, data: {} },
    { id: 'light1', type: Output.LIGHT, position: { x: 300, y: 50 }, data: {} },
];

const initialEdges: Edge[] = [
    { id: 'clock1-gate1', source: 'clock1', target: 'gate1', targetHandle: 'a', type: 'powered-edge' },
    { id: 'high1-gate1', source: 'high1', target: 'gate1', targetHandle: 'b', type: 'powered-edge' },
    { id: 'gate1-light1', source: 'gate1', target: 'light1', type: 'powered-edge' },
];

function EditorTab() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const { addEdges } = useReactFlow();

    // useEffect(() => {
    //     const lastEdge = edges.at(-1);
    //     if (!lastEdge) return;
    //     const nodeOutputState = getNodeOutputState({ id: lastEdge.source });
    //     updateEdgeStyle(lastEdge, lastEdge.sourceHandle ? nodeOutputState.has(lastEdge.sourceHandle) : nodeOutputState.size > 0)
    // }, [edges, setEdges])

    const onNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
            changes.filter((change) => change.type === "add").forEach((change) => {
                const node = change.item;
                if (node.type && node.type in componentRegistry) {
                    const evaluator = componentRegistry[node.type as ComponentType];
                    if (evaluator.initialize) {
                        evaluator.initialize(node);
                    }
                }
            });
        },
        [setNodes],
    );

    const onNodesDelete = (nodes: Node[]) => {
        nodes.forEach((node) => {
            if (node.type && node.type in componentRegistry) {
                const component = componentRegistry[node.type as ComponentType];
                if (component.remove) {
                    component.remove(node);
                }
            }
        })
    };

    const onEdgesChange = useCallback(
        (changes: EdgeChange<Edge>[]) => {
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
            for (const change of changes) {
                if (change.type === "add") {
                    const edge = change.item;
                    const nodeOutputState = getNodeOutputState({ id: edge.source });
                    updateEdgeStyle(edge, edge.sourceHandle ? nodeOutputState.has(edge.sourceHandle) : nodeOutputState.size > 0)
                }
            }
        },
        [setEdges],
    );

    const onConnect = (connection: Connection) => {
        const newEdge = {
            id: getEdgeId(connection),
            ...connection,
            type: 'powered-edge',
        };
        addEdges(newEdge);
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
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