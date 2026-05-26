import type {ComponentType, SVGProps, ReactElement} from 'react';
import AndGateSvg from '../assets/components/gates/AndGate.svg?react';
import OrGateSvg from '../assets/components/gates/OrGate.svg?react';
import BufferSVG from '../assets/components/gates/BufferGate.svg?react';
import './ComponentTree.css';

export default function ComponentTree() {
    return (
        <div style={{textAlign: 'left'}}>
            <ComponentCategory label={"Logic Gates"}>
                <ComponentItem label={"AND Gate"} icon={AndGateSvg} />
                <ComponentItem label={"OR Gate"} icon={OrGateSvg} />
                <ComponentItem label={"Buffer"} icon={BufferSVG} />
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