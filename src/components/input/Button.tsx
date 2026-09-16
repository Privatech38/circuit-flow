import {
    Handle,
    Position,
    type Node,
    type NodeProps, useReactFlow
} from '@xyflow/react';
import ButtonSVG from '@assets/components/input/Button.svg?react';
import type {CircuitComponentData, InputCircuitComponent} from "@/components/Component.tsx";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";
import {componentUpdatedBus} from "@/components";

export const Button: InputCircuitComponent = {
    evaluate: () => {},

    component: (props: NodeProps<Node<CircuitComponentData>>) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {getNode} = useReactFlow();

        const setPressed = (pressed: boolean) => {
            const node = getNode(props.id);
            if (!node) {
                console.error(`Node with id ${props.id} not found in React Flow instance.`);
                return;
            }
            setHandleOutputUpdate(node, "out", pressed);
            componentUpdatedBus.emit('stateChange');
        };

        return (
            <div style={{position: 'relative', lineHeight: 0}}>
                <ButtonSVG className="component-shape" height={50}/>

                <button
                    className={"nodrag"}
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