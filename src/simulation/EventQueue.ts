import type {Node} from "@xyflow/react";
import Queue from "yocto-queue";

export interface TriggeredNode {
    node: Node;
    targetHandle?: string | null | undefined;
}

export const EventQueue: Queue<TriggeredNode> = new Queue();