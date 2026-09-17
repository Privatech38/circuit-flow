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
function DecoderNode(props: NodeProps<Node<CircuitComponentData>>) {
    const nodeData = props?.data as EncoderData | undefined;

    const numInputs = nodeData?.slots || DEFAULT_ENCODER_SLOTS;
    const numOutputs = 2 ** numInputs;

    const {
        width,
        height,
        heightDecrease,
        inputPaddingPercentage,
        inputPercentage,
    } = computeMuxLayout(1, numOutputs);

    const binaryPaddingPercentage = (height - (numInputs - 1) * INPUT_SPACING) / 2 / height * 100;
    const binaryPercentage = 100 - 2 * binaryPaddingPercentage;

    return (
        <div style={{position: 'relative', width: width, height}}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block'}}>
                <polygon
                    points={`1,${heightDecrease + 1} ${width - 1},1 ${width - 1},${height - 1} 1,${height - heightDecrease - 1}`}
                    className="component-shape"
                />
            </svg>

            {/* Input handles */}
            {Array.from({length: numInputs}, (_, i) => (
                <Handle
                    key={`d${i}`}
                    type="target"
                    position={Position.Left}
                    id={`d${i}`}
                    style={{top: `${(i / (numInputs - 1)) * binaryPercentage + binaryPaddingPercentage}%`}}
                />
            ))}

            {/* Data input handles */}
            {Array.from({length: numOutputs}, (_, i) => (
                <Handle
                    key={`s${i}`}
                    type="source"
                    position={Position.Right}
                    id={`d${i}`}
                    style={{top: `${(i / (numOutputs - 1)) * inputPercentage + inputPaddingPercentage}%`}}
                />
            ))}
        </div>
    );
}

export const Decoder: CircuitComponent = {
    evaluate: (node: Node, inputSnapshot: Set<string>) => {
        const data = node.data as EncoderData;
        const numInputs = data?.slots || DEFAULT_ENCODER_SLOTS;
        const numOutputs = 2 ** numInputs;

        let outputIndex = 0;
        for (let i = 0; i < numInputs; i++) {
            if (inputSnapshot.has(`d${i}`)) {
                outputIndex |= (1 << i);
            }
        }

        for (let i = 0; i < numOutputs; i++) {
            if (i == outputIndex)
                continue;
            setHandleOutputUpdate(node, `d${i}`, false);
        }

        if (inputSnapshot.size == 0)
            return

        setHandleOutputUpdate(node, `d${outputIndex}`, true);
    },

    component: DecoderNode,
}
