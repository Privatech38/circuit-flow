import type {Node} from "@xyflow/react";
import type {JSX} from "react/jsx-runtime";

export interface CircuitComponent {
    evaluate: (node: Node) => void;
    component: () => JSX.Element;
}

export interface ComponentProps {
    /**
     * A list of active output IDs.
     */
    activeOutputs: Set<string>;
}