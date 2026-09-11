import type {Node} from "@xyflow/react";
import Queue from "yocto-queue";
import {getHandleState, getTargetHandles} from "@/simulation/ReactFlowUtils.ts";

export interface TriggeredNode {
    node: Node;
    inputSnapshot: Set<string>;
    targetHandle?: string | null | undefined;
}

export const EventQueue: Queue<TriggeredNode> = new Queue();

export function enqueueTriggeredNode(node: Node, targetHandle?: string | null | undefined) {
    const inputSnapshot = new Set<string>();
    const targetHandles = getTargetHandles(node);
    for (const handle of targetHandles) {
        if (handle && getHandleState(node, { id: handle })) {
            inputSnapshot.add(handle);
        }
    }
    EventQueue.enqueue({ node, inputSnapshot, targetHandle });
}