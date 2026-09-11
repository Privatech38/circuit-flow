import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import TFlipFlopSVG from '@assets/components/latches/TFlipFlop.svg?react'
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const TFlipFlop: CircuitComponent = {
    initialize: (node: Node) => {
        setHandleOutputUpdate(node, "Q_not", true);
    },

    evaluate: (node: Node, inputSnapshot: Set<string>, targetHandle: string | null | undefined) => {
        if (!targetHandle || targetHandle !== "Clk")
            return;
        const clock = inputSnapshot.has("Clk");
        if (!clock)
            return;

        const isTOn = inputSnapshot.has("T");

        let Q = getHandleState(node, { id: "Q" });
        let Q_not = getHandleState(node, { id: "Q_not" });

        if (isTOn) {
            // Toggle
            Q = !Q;
            Q_not = !Q_not;
        }

        setHandleOutputUpdate(node, "Q", Q);
        setHandleOutputUpdate(node, "Q_not", Q_not);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <TFlipFlopSVG className="component-shape" height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="T" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="Clk" style={{top: '70%'}}/>

            {/* Output handles */}
            <Handle type="source" position={Position.Right} id="Q" style={{top: '30%'}}/>
            <Handle type="source" position={Position.Right} id="Q_not" style={{top: '70%'}}/>
        </div>
    )
}
