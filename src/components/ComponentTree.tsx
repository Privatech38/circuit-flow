import type {ComponentType, SVGProps, ReactElement} from 'react';
import {useCallback, useRef, useState} from 'react';
import {type Node, useReactFlow, type XYPosition} from '@xyflow/react';
import {useDraggable} from '@neodrag/react';
import ClockSVG from '@assets/components/input/Clock.svg?react';
import HighSVG from '@assets/components/input/High.svg?react';
import LowSVG from '@assets/components/input/Low.svg?react';
import LightSVG from '@assets/components/output/Light.svg?react';
import AndGateSvg from '../assets/components/gates/AndGate.svg?react';
import OrGateSvg from '../assets/components/gates/OrGate.svg?react';
import BufferSVG from '../assets/components/gates/BufferGate.svg?react';
import NOTGateSVG from '../assets/components/gates/NotGate.svg?react';
import NANDGateSVG from '../assets/components/gates/NAndGate.svg?react';
import NORGateSVG from '../assets/components/gates/NOrGate.svg?react';
import XORGateSVG from '../assets/components/gates/XOrGate.svg?react';
import XNORGateSVG from '../assets/components/gates/XNOrGate.svg?react';
import './ComponentTree.css';
import {LogicGate} from "./gates";
import {Output} from "@/components/output";
import {Input} from "@/components/input";

export default function ComponentTree() {
    const {setNodes, screenToFlowPosition} = useReactFlow();

    const handleNodeDrop = useCallback(
        (nodeType: string, screenPosition: XYPosition) => {
            const flow = document.querySelector('.react-flow');
            const flowRect = flow?.getBoundingClientRect();
            const isInFlow =
                flowRect &&
                screenPosition.x >= flowRect.left &&
                screenPosition.x <= flowRect.right &&
                screenPosition.y >= flowRect.top &&
                screenPosition.y <= flowRect.bottom;

            // Create a new node and add it to the flow
            if (isInFlow) {
                const position = screenToFlowPosition(screenPosition);

                const newNode: Node = {
                    id: crypto.randomUUID(),
                    type: nodeType,
                    position,
                    data: {},
                };

                setNodes((nds) => nds.concat(newNode));
            }
        },
        [setNodes, screenToFlowPosition],
    );

    return (
        <div style={{textAlign: 'left'}}>
            <ComponentCategory label={"Inputs"}>
                <ComponentItem componentID={Input.CLOCK} label={"Clock"} icon={ClockSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={Input.HIGH} label={"High"} icon={HighSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={Input.LOW} label={"Low"} icon={LowSVG} onDrop={handleNodeDrop}/>
            </ComponentCategory>
            <ComponentCategory label={"Outputs"}>
                <ComponentItem componentID={Output.LIGHT} label={"Light"} icon={LightSVG} onDrop={handleNodeDrop}/>
            </ComponentCategory>
            <ComponentCategory label={"Logic Gates"}>
                <ComponentItem componentID={LogicGate.AND} label={"AND"} icon={AndGateSvg} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.OR} label={"OR"} icon={OrGateSvg} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.NOT} label={"NOT"} icon={NOTGateSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.BUFFER} label={"Buffer"} icon={BufferSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.NAND} label={"NAND"} icon={NANDGateSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.NOR} label={"NOR"} icon={NORGateSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.XOR} label={"XOR"} icon={XORGateSVG} onDrop={handleNodeDrop}/>
                <ComponentItem componentID={LogicGate.XNOR} label={"XNOR"} icon={XNORGateSVG} onDrop={handleNodeDrop}/>
            </ComponentCategory>
        </div>
    )

    function ComponentCategory({children, label}: ComponentCategoryProps) {
        return (
            <div className="component-category" aria-label={label}>
                <h4 className="component-category__label">{label}</h4>
                <div className="component-category__content">
                    {children}
                </div>
            </div>
        )
    }

    function ComponentItem({componentID, label, icon: Icon, onDrop}: ComponentItemProps) {
        const draggableRef = useRef<HTMLDivElement>(null!);
        const [position, setPosition] = useState<XYPosition>({ x: 0, y: 0 });

        useDraggable(draggableRef, {
            position: position,
            onDrag: ({ offsetX, offsetY }) => {
                // Calculate position relative to the viewport
                setPosition({
                    x: offsetX,
                    y: offsetY,
                });
            },
            onDragEnd: ({ event }) => {
                setPosition({ x: 0, y: 0 });
                onDrop(componentID, {
                    x: event.clientX,
                    y: event.clientY,
                });
            },
        });

        return (
            <div className="component-item" aria-label={label} ref={draggableRef} style={{ zIndex: 200}}>
                <div className="component-item__icon" aria-hidden="true">
                    <Icon/>
                </div>
                <div className="component-item__label">{label}</div>
            </div>
        )
    }
}

interface ComponentCategoryProps {
    children?: ReactElement<ComponentItemProps> | ReactElement<ComponentItemProps>[];
    label: string;
}

interface ComponentItemProps {
    componentID: string;
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>
    onDrop: (nodeId: string, position: XYPosition) => void
}