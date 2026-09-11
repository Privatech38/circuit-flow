import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import JKFlipFlopSVG from '@assets/components/latches/JKFlipFlop.svg?react'
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const JKFlipFlop: CircuitComponent = {
    initialize: (node: Node) => {
        setHandleOutputUpdate(node, "Q_not", true);
    },

    evaluate: (node: Node, inputSnapshot: Set<string>, targetHandle: string | null | undefined) => {
        if (!targetHandle || targetHandle !== "Clk")
            return;
        const clock = inputSnapshot.has("Clk");
        if (!clock)
            return;

        const isJOn = inputSnapshot.has("J");
        const isKOn = inputSnapshot.has("K");

        let Q = getHandleState(node, { id: "Q" });
        let Q_not = getHandleState(node, { id: "Q_not" });

        if (!isJOn && !isKOn) {
            // Hold
        } else if (isJOn && !isKOn) {
            Q = true;
            Q_not = false;
        } else if (!isJOn && isKOn) {
            Q = false;
            Q_not = true;
        } else if (isJOn && isKOn) {
            // Toggle
            Q = !Q;
            Q_not = !Q_not;
        }

        setHandleOutputUpdate(node, "Q", Q);
        setHandleOutputUpdate(node, "Q_not", Q_not);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <JKFlipFlopSVG className="component-shape" height={60} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="J" style={{top: '23.33%'}}/>
            <Handle type="target" position={Position.Left} id="Clk" style={{top: '50%'}}/>
            <Handle type="target" position={Position.Left} id="K" style={{top: '76.67%'}}/>

            {/* Output handles */}
            <Handle type="source" position={Position.Right} id="Q" style={{top: '30%'}}/>
            <Handle type="source" position={Position.Right} id="Q_not" style={{top: '70%'}}/>
        </div>
    )
}
