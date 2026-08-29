import {
    Handle,
    Position,
    type Node,
    type NodeProps
} from '@xyflow/react';
import type {CircuitComponent} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";
import {
    clampSelectBits,
    computeMuxLayout,
    getSelectedIndex,
    type MultiplexerProps,
} from "@/components/multiplexer/index.ts";


// eslint-disable-next-line react-refresh/only-export-components -- CircuitComponent bundles data (evaluate) and the component together, so this file can't be component-only
function MultiplexerNode(props?: NodeProps) {
    const nodeData = props?.data as MultiplexerProps | undefined;

    const selectBits = clampSelectBits(nodeData?.selectBits);
    const numInputs = 2 ** selectBits;

    const {
        width,
        height,
        heightDecrease,
        heightDecreasePercentage,
        horizontalPaddingPercentage,
        horizontalInputPercentage,
        inputPaddingPercentage,
        inputPercentage,
    } = computeMuxLayout(selectBits, numInputs);

    return (
        <div style={{position: 'relative', width: width, height}}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block'}}>
                <polygon
                    points={`1,1 ${width - 1},${heightDecrease + 1} ${width - 1},${height - heightDecrease - 1} 1,${height - 1}`}
                    fill="white"
                    stroke="black"
                    strokeWidth={2}
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

            {/* Select input handles */}
            {Array.from({length: selectBits}, (_, i) => {
                const position = (i / (selectBits - 1)) * horizontalInputPercentage + horizontalPaddingPercentage;
                return (
                    <Handle
                        key={`s${i}`}
                        type="target"
                        position={Position.Bottom}
                        id={`s${i}`}
                        style={{
                            left: `${position}%`,
                            bottom: `${position / 100 * heightDecreasePercentage}%`
                        }}
                    />
                );
            })}

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="out"
                style={{top: `50%`}}
            />
        </div>
    );
}

export const Multiplexer: CircuitComponent = {
    evaluate: (node: Node) => {
        const data = node.data as MultiplexerProps;
        const selectBits = clampSelectBits(data.selectBits);
        const selectedIndex = getSelectedIndex(node, selectBits);

        const output = getHandleState(node, {id: `d${selectedIndex}`});
        setHandleOutputUpdate(node, "out", output);
    },

    component: MultiplexerNode,
}
