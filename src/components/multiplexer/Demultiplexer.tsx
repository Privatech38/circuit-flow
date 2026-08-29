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
function DemultiplexerNode(props?: NodeProps) {
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
                    points={`1,${heightDecrease + 1} ${width - 1},1 ${width - 1},${height - 1} 1,${height - heightDecrease - 1}`}
                    fill="white"
                    stroke="black"
                    strokeWidth={2}
                />
            </svg>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="in"
                style={{top: `50%`}}
            />

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
                            bottom: `${((100 - position) / 100) * heightDecreasePercentage}%`
                        }}
                    />
                );
            })}

            {/* Data output handles */}
            {Array.from({length: numInputs}, (_, i) => (
                <Handle
                    key={`o${i}`}
                    type="source"
                    position={Position.Right}
                    id={`o${i}`}
                    style={{top: `${(i / (numInputs - 1)) * inputPercentage + inputPaddingPercentage}%`}}
                />
            ))}
        </div>
    );
}

export const Demultiplexer: CircuitComponent = {
    evaluate: (node: Node) => {
        const data = node.data as MultiplexerProps;
        const selectBits = clampSelectBits(data.selectBits);
        const selectedIndex = getSelectedIndex(node, selectBits);

        const input = getHandleState(node, {id: 'in'});
        setHandleOutputUpdate(node, `o${selectedIndex}`, input);
    },

    component: DemultiplexerNode,
}
