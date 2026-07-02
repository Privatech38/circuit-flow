import type {Node} from "@xyflow/react";
// import {componentRegistry, type ComponentType} from "@/components/ComponentRegistry.ts";

// interface Event {
//     node: Node;
// }

// const EventQueue: Event[] = [];

/**
 * Triggers an update on the specified node.
 * @param node
 */
export function triggerUpdate(node: Node) {
    if (!node.type)
        throw new Error("Type for node is undefined");
    // if (node.type in componentRegistry) {
    //     const component = componentRegistry[node.type as ComponentType];
    //     component.evaluate(node);
    // }
}