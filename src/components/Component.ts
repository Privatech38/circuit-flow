import type {Node, NodeProps} from "@xyflow/react";
import type {JSX} from "react/jsx-runtime";

export interface CircuitComponent {
    initialize?: (node: Node) => void;
    remove?: (node: Node) => void;
    pause?: (node: Node) => void;
    resume?: (node: Node) => void;
    stop?: (node: Node) => void;
    evaluate: (node: Node, inputSnapshot: Set<string>, targetHandle?: string | null | undefined) => void;
    component: (props?: NodeProps) => JSX.Element;
}

export type CircuitComponentProps = {
    label: string;
}