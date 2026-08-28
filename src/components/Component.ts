import type {Node, NodeProps} from "@xyflow/react";
import type {JSX} from "react/jsx-runtime";

export interface CircuitComponent {
    initialize?: (node: Node) => void;
    remove?: (node: Node) => void;
    evaluate: (node: Node) => void;
    component: (props?: NodeProps) => JSX.Element;
}

export type CircuitComponentProps = {
    label: string;
}