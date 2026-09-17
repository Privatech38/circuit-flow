import {
    Handle,
    Position,
    type Node,
    type NodeProps
} from '@xyflow/react';
import type {CircuitComponent, CircuitComponentData} from "@/components/Component.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";
import {
    computeMuxLayout, DEFAULT_ENCODER_SLOTS, type EncoderData, INPUT_SPACING,
} from "@/components/multiplexer/index.ts";

// eslint-disable-next-line react-refresh/only-export-components -- CircuitComponent bundles data (evaluate) and the component together, so this file can't be component-only
function EncoderNode(props: NodeProps<Node<CircuitComponentData>>) {
    const nodeData = props?.data as EncoderData | undefined;

    const numOutputs = nodeData?.slots || DEFAULT_ENCODER_SLOTS;
    const numInputs = 2 ** numOutputs;

    const {
        width,
        height,
        heightDecrease,
        inputPaddingPercentage,
        inputPercentage,
    } = computeMuxLayout(1, numInputs);

    const outputPaddingPercentage = (height - (numOutputs - 1) * INPUT_SPACING) / 2 / height * 100;
    const outputPercentage = 100 - 2 * outputPaddingPercentage;

    return (
        <div style={{position: 'relative', width: width, height}}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block'}}>
                <polygon
                    points={`1,1 ${width - 1},${heightDecrease + 1} ${width - 1},${height - heightDecrease - 1} 1,${height - 1}`}
                    className="component-shape"
                />
            </svg>

            {/* Data input handles */}
            {Array.from({length: numInputs}, (_, i) => (
                <Handle
                    key={`d${i}`}
                    type="target"
                    position={Position.Left}
                    id={`d${i}`}
                    style={{top: `${(i / (numInputs - 1)) * inputPercentage + inputPaddingPercentage}%`}}
                />
            ))}

            {/* Output handles */}
            {Array.from({length: numOutputs}, (_, i) => (
                <Handle
                    key={`s${i}`}
                    type="source"
                    position={Position.Right}
                    id={`s${i}`}
                    style={{top: `${(i / (numOutputs - 1)) * outputPercentage + outputPaddingPercentage}%`}}
                />
            ))}
        </div>
    );
}

export const Encoder: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const data = node.data as EncoderData;
        const numOutputs = data.slots || DEFAULT_ENCODER_SLOTS;
        const numInputs = 2 ** numOutputs;

        if (inputSnapshot.size != 1) {
            for (let i = 0; i < numOutputs; i++) {
                setHandleOutputUpdate(node, `s${i}`, false);
            }
        }

        let activeIndex = 0;
        for (let i = 0; i < numInputs; i++) {
            if (inputSnapshot.has(`d${i}`)) {
                activeIndex = i;
                break;
            }
        }

        for (let i = 0; i < numOutputs; i++) {
            setHandleOutputUpdate(node, `s${i}`, ((activeIndex >> i) & 1) === 1);
        }
    },

    component: EncoderNode,
}
