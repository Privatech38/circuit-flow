import {
    Handle,
    Position,
    type Node,
    type NodeProps, useReactFlow
} from '@xyflow/react';
import ButtonSVG from '@assets/components/input/Button.svg?react';
import type {CircuitComponentData, InputCircuitComponent} from "@/components/Component.tsx";
import {componentUpdatedBus} from "@/components";
import {EventQueue} from "@/simulation/EventQueue.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

const states = new Map<Node, boolean>();

export const Button: InputCircuitComponent = {

    initialize: (node: Node) => {
        Button.evaluate(node);
    },

    evaluate: (node: Node) => {
        setHandleOutputUpdate(node, "out", states.has(node) && states.get(node)!);
    },

    component: (props: NodeProps<Node<CircuitComponentData>>) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {getNode} = useReactFlow();

        const setPressed = (pressed: boolean) => {
            const node = getNode(props.id);
            if (!node) {
                console.error(`Node with id ${props.id} not found in React Flow instance.`);
                return;
            }
            states.set(node, pressed);
            EventQueue.enqueue({node: node, inputSnapshot: new Set(), targetHandle: ""})
            componentUpdatedBus.emit('stateChange');
        };

        return (
            <div style={{position: 'relative', lineHeight: 0}}>
                <ButtonSVG className="component-shape" height={50}/>

                <button
                    className="nodrag"
                    style={{width: '80%', height: '80%', position: "absolute", top: "10%", left: "10%"}}
                    onPointerDown={() => setPressed(true)}
                    onPointerUp={() => setPressed(false)}
                    onPointerLeave={() => setPressed(false)}
                />

                {/* Output handle */}
                <Handle type="source" position={Position.Right} id="out"/>
            </div>
        );
    }
}