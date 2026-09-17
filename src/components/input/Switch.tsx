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

export const Switch: InputCircuitComponent = {

    evaluate: () => {},

    component: (props: NodeProps<Node<CircuitComponentData>>) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {getNode} = useReactFlow();

        const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            const node = getNode(props.id);
            if (!node) {
                console.error(`Node with id ${props.id} not found in React Flow instance.`);
                return;
            }
            setHandleOutputUpdate(node, "out", checked);
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
