import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import TFlipFlopSVG from '@assets/components/latches/TFlipFlop.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const TFlipFlop: CircuitComponent = {
    initialize: (node: Node) => {
        setHandleOutputUpdate(node, "Q_not", true);
    },

    evaluate: (node: Node, targetHandle: string | null | undefined) => {
        if (!targetHandle || targetHandle !== "Clk")
            return;
        const clock = getHandleState(node, { id: "Clk" });
        if (!clock)
            return;

        const isTOn = getHandleState(node, { id: "T" });

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
            <img src={TFlipFlopSVG} alt="T flip-flop" height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="T" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="Clk" style={{top: '70%'}}/>

            {/* Output handles */}
            <Handle type="source" position={Position.Right} id="Q" style={{top: '30%'}}/>
            <Handle type="source" position={Position.Right} id="Q_not" style={{top: '70%'}}/>
        </div>
    )
}
