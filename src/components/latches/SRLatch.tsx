import {
    Handle, type Node,
    Position
} from '@xyflow/react';
import SRLatchSVG from '@assets/components/latches/SRLatch.svg?react'
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

export const SRLatch: CircuitComponent = {
    initialize: (node: Node) => {
        setHandleOutputUpdate(node, "Q_not", true);
    },

    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const isSOn = inputSnapshot.has("S");
        const isROn = inputSnapshot.has("R");

        let Q = getHandleState(node, { id: "Q" });
        let Q_not = getHandleState(node, { id: "Q_not" });

        if (!isSOn && !isROn) {
            return;
        } else if (isSOn && !isROn) {
            Q = true;
            Q_not = false;
        } else if (!isSOn && isROn) {
            Q = false;
            Q_not = true;
        } else if (isSOn && isROn) {
            // Forbidden state, both S and R are high
            Q = false;
            Q_not = true;
        }

        setHandleOutputUpdate(node, "Q", Q);
        setHandleOutputUpdate(node, "Q_not", Q_not);
    },

    component: () => (
        <div style={{position: 'relative', lineHeight: 0}}>
            <SRLatchSVG className="component-shape" height={50} />

            {/* Input handles */}
            <Handle type="target" position={Position.Left} id="S" style={{top: '30%'}}/>
            <Handle type="target" position={Position.Left} id="R" style={{top: '70%'}}/>

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id="Q" style={{top: '30%'}}/>
            <Handle type="source" position={Position.Right} id="Q_not" style={{top: '70%'}}/>
        </div>
    )
}