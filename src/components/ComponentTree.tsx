import type {ComponentType, SVGProps, ReactElement} from 'react';
import AndGateSvg from '../assets/components/gates/AndGate.svg?react';
import OrGateSvg from '../assets/components/gates/OrGate.svg?react';
import BufferSVG from '../assets/components/gates/BufferGate.svg?react';
import NOTGateSVG from '../assets/components/gates/NotGate.svg?react';
import NANDGateSVG from '../assets/components/gates/NAndGate.svg?react';
import NORGateSVG from '../assets/components/gates/NOrGate.svg?react';
import XORGateSVG from '../assets/components/gates/XOrGate.svg?react';
import XNORGateSVG from '../assets/components/gates/XNOrGate.svg?react';
import './ComponentTree.css';

export default function ComponentTree() {
    return (
        <div style={{textAlign: 'left'}}>
            <ComponentCategory label={"Logic Gates"}>
                <ComponentItem label={"AND"} icon={AndGateSvg} />
                <ComponentItem label={"OR"} icon={OrGateSvg} />
                <ComponentItem label={"NOT"} icon={NOTGateSVG} />
                <ComponentItem label={"Buffer"} icon={BufferSVG} />
                <ComponentItem label={"NAND"} icon={NANDGateSVG} />
                <ComponentItem label={"NOR"} icon={NORGateSVG} />
                <ComponentItem label={"XOR"} icon={XORGateSVG} />
                <ComponentItem label={"XNOR"} icon={XNORGateSVG} />
            </ComponentCategory>
        </div>
    )

    function ComponentCategory({ children, label }: ComponentCategoryProps) {
        return (
            <div className="component-category" aria-label={label}>
                <h4 className="component-category__label">{label}</h4>
                <div className="component-category__content">
                    {children}
                </div>
            </div>
        )
    }

    function ComponentItem({ label, icon: Icon }: ComponentItemProps) {
        return (
            <div className="component-item" aria-label={label}>
                <div className="component-item__icon" aria-hidden="true">
                    <Icon />
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
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>
}