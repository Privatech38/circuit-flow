import {
    Handle,
    Position,
    type Node,
    type NodeProps,
    useReactFlow
} from '@xyflow/react';
import type {ChangeEvent} from 'react';
import MuiSwitch from '@mui/material/Switch';
import ButtonSVG from '@assets/components/input/Button.svg?react';
import type {CircuitComponentData, InputCircuitComponent} from "@/components/Component.tsx";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";
import {componentUpdatedBus} from "@/components";
import {EventQueue} from "@/simulation/EventQueue.ts";

const states = new Map<Node, boolean>

export const Switch: InputCircuitComponent = {

    initialize: (node: Node) => {
        Switch.evaluate(node);
    },

    evaluate: (node: Node) => {
        setHandleOutputUpdate(node, "out", states.has(node) && states.get(node)!);
    },

    component: (props: NodeProps<Node<CircuitComponentData>>) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {getNode} = useReactFlow();

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const node = getNode(props.id);
            if (!node) {
                console.error(`Node with id ${props.id} not found in React Flow instance.`);
                return;
            }
            states.set(node, event.target.checked);
            EventQueue.enqueue({node: node, inputSnapshot: new Set(), targetHandle: ""})
            componentUpdatedBus.emit('stateChange');
        };

        return (
            <div style={{
                position: 'relative', lineHeight: 0, display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <ButtonSVG className="component-shape" height={50}/>

                <MuiSwitch
                    className="nodrag"
                    size="small"
                    onChange={handleChange}
                    sx={{transform: 'rotate(-90deg)', position: 'absolute'}}
                />

                {/* Output handle */}
                <Handle type="source" position={Position.Right} id="out"/>
            </div>
        );
    }
}
