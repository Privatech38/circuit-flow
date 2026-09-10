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
import {getEdgeId} from '@xyflow/system';
import '@xyflow/react/dist/style.css';
import {LogicGate, logicGateTypes} from "@/components/gates";
import {Input, inputTypes} from "@/components/input";
import {Output, outputTypes} from "@/components/output";
import {multiplexerTypes} from "@/components/multiplexer";
import {syncSimulationEdges, syncSimulationNodes} from "@/simulation/ReactFlowUtils.ts";
import {getNodeOutputState, updateEdgeStyle} from "@/simulation/WireManager.ts";
import {componentRegistry, type ComponentType} from "@/components/ComponentRegistry.ts";
import {PoweredEdge} from "@/editor/PoweredEdge.tsx";
import {EventQueue} from "@/simulation/EventQueue.ts";
import {getSimulationState, stepSimulation} from "@/simulation/SimulationManager.ts";
import {latchTypes} from "@/components/latches";

const nodeTypes = {
    ...logicGateTypes,
    ...inputTypes,
    ...outputTypes,
    ...multiplexerTypes,
    ...latchTypes
}

const edgeTypes = {
    'powered-edge': PoweredEdge
}

const defaultEdgeOptions: DefaultEdgeOptions = {
    type: 'powered-edge',
}

const initialNodes: Node[] = [
    {id: 'clock1', type: Input.CLOCK, position: {x: 0, y: 0}, data: {}},
    {id: 'high1', type: Input.HIGH, position: {x: 0, y: 100}, data: {}},
    {id: 'gate1', type: LogicGate.AND, position: {x: 150, y: 50}, data: {}},
    {id: 'light1', type: Output.LIGHT, position: {x: 300, y: 50}, data: {}},
];

const initialEdges: Edge[] = [
    {id: 'clock1-gate1', source: 'clock1', sourceHandle: 'out', target: 'gate1', targetHandle: 'a', type: 'powered-edge'},
    {id: 'high1-gate1', source: 'high1', sourceHandle: 'out', target: 'gate1', targetHandle: 'b', type: 'powered-edge'},
    {id: 'gate1-light1', source: 'gate1', sourceHandle: 'out', target: 'light1', type: 'powered-edge'},
];

function EditorTab() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Keep the simulation's view of the graph in sync with the latest committed render.
    // React Flow's own store only picks up controlled nodes/edges props in a useEffect,
    // which runs too late for handlers that step the simulation synchronously (see below).
    syncSimulationNodes(nodes);
    syncSimulationEdges(edges);

    const {addEdges, getNode} = useReactFlow();

    const onNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => {
            setNodes((nodesSnapshot) => {
                const nextNodes = applyNodeChanges(changes, nodesSnapshot);
                syncSimulationNodes(nextNodes);
                return nextNodes;
            });
            if (getSimulationState() == "stopped")
                return;
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
            const removedEdges: Edge[] = [];
            setEdges((edgesSnapshot) => {
                for (const change of changes) {
                    if (change.type === "remove") {
                        const removedEdge = edgesSnapshot.find((edge) => edge.id === change.id);
                        if (removedEdge) {
                            removedEdges.push(removedEdge);
                        }
                    }
                }
                const nextEdges = applyEdgeChanges(changes, edgesSnapshot);
                syncSimulationEdges(nextEdges);
                return nextEdges;
            });
            for (const change of changes) {
                if (change.type === "add") {
                    const edge = change.item;
                    const nodeOutputState = getNodeOutputState({id: edge.source});
                    updateEdgeStyle(edge, edge.sourceHandle ? nodeOutputState.has(edge.sourceHandle) : nodeOutputState.size > 0)
                    const targetNode = getNode(edge.target);
                    if (targetNode) {
                        EventQueue.enqueue(targetNode);
                        stepSimulation();
                    }
                }
            }
            // A removed edge may have been a target node's only HIGH source, so re-evaluate it now
            // that the graph no longer includes that wire, instead of leaving its last state stuck.
            for (const edge of removedEdges) {
                const targetNode = getNode(edge.target);
                if (targetNode) {
                    EventQueue.enqueue(targetNode);
                    stepSimulation();
                }
            }
        },
        [setEdges, getNode],
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
        <div style={{width: '100%', height: '100%'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.SmoothStep}
            >
                <Controls/>
                <MiniMap/>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
            </ReactFlow>
        </div>
    );
}

export default EditorTab