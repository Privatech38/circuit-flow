import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import DFlipFlopSVG from '@assets/components/latches/DFlipFlop.svg'
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const DFlipFlop: CircuitComponent = {
    initialize: (node: Node) => {
        setHandleOutputUpdate(node, "Q_not", true);
    },

    evaluate: (node: Node, targetHandle: string | null | undefined) => {
        const isSOn = getHandleState(node, { id: "S" });
        const isROn = getHandleState(node, { id: "R" });

        let Q = getHandleState(node, { id: "Q" });
        let Q_not = getHandleState(node, { id: "Q_not" });

        if (!isSOn && !isROn) {
            // D flip-flop behavior
            if (!targetHandle || targetHandle !== "Clk")
                return;
            const clock = getHandleState(node, { id: "Clk" });
            if (clock) {
                const D = getHandleState(node, { id: "D" });
                Q = D;
                Q_not = !D;
            } else {
                return;
            }
        } else if (isSOn && !isROn) {
            Q = true;
            Q_not = false;
        } else if (!isSOn && isROn) {
            Q = false;
            Q_not = true;
        } else if (isSOn && isROn) {
            Q = true;
            Q_not = true;
        }

        setHandleOutputUpdate(node, "Q", Q);
        setHandleOutputUpdate(node, "Q_not", Q_not);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <img src={DFlipFlopSVG} alt="D flip-flop" height={60} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="D" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="Clk" style={{top: '70%'}}/>
            <Handle type={"target"} position={Position.Top} id="S"/>
            <Handle type={"target"} position={Position.Bottom} id="R"/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="Q" style={{top: '30%'}}/>
            <Handle type="source" position={Position.Right} id="Q_not" style={{top: '70%'}}/>
        </div>
    )
}