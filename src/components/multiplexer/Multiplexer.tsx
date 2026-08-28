import {
    Handle,
    Position,
    useNodeId,
    useNodesData,
    useReactFlow,
    type Node
} from '@xyflow/react';
import type {CircuitComponent, CircuitComponentProps} from "@/components/Component.ts";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";
import {setHandleOutputUpdate} from "@/simulation/WireManager.ts";

type MultiplexerProps = CircuitComponentProps & {
    selectBits: number;
}

const MIN_SELECT_BITS = 1;
const MAX_SELECT_BITS = 4;
const DEFAULT_SELECT_BITS = 2;

const ANGLE = (20 / 180) * Math.PI; // 20 degrees in radians
const INPUT_SPACING = 16;
const VERTICAL_PADDING = 16;
const MIN_WIDTH = 50;

const HORIZONTAL_PADDING = VERTICAL_PADDING * Math.cos(ANGLE);
const HORIZONTAL_SPACING = INPUT_SPACING * Math.cos(ANGLE);

function clampSelectBits(value: number | undefined): number {
    if (value === undefined || Number.isNaN(value)) {
        return DEFAULT_SELECT_BITS;
    }
    return Math.min(MAX_SELECT_BITS, Math.max(MIN_SELECT_BITS, Math.round(value)));
}

// eslint-disable-next-line react-refresh/only-export-components -- CircuitComponent bundles data (evaluate) and the component together, so this file can't be component-only
function MultiplexerNode() {
    const nodeId = useNodeId();
    const nodeData = useNodesData<Node>(nodeId ?? "");
    const {updateNodeData} = useReactFlow();

    const selectBits = clampSelectBits((nodeData?.data as MultiplexerProps | undefined)?.selectBits);
    const numInputs = 2 ** selectBits;

    const width = Math.max(MIN_WIDTH, HORIZONTAL_PADDING * 2 + (selectBits - 1) * HORIZONTAL_SPACING);
    const horizontalPaddingPercentage = (width > MIN_WIDTH ? HORIZONTAL_PADDING : (MIN_WIDTH - (selectBits - 1) * HORIZONTAL_SPACING) / 2) / width * 100;
    const horizontalInputPercentage = 100 - 2 * horizontalPaddingPercentage;

    const height = VERTICAL_PADDING * 2 + (numInputs - 1) * INPUT_SPACING;
    const heightDecrease = Math.tan(ANGLE) * width;
    const heightDecreasePercentage = heightDecrease * 100 / height;

    const inputPaddingPercentage = VERTICAL_PADDING / height * 100;
    const inputPercentage = 100 - 2 * inputPaddingPercentage;

    const changeSelectBits = (delta: number) => {
        if (!nodeId) return;
        updateNodeData(nodeId, {selectBits: clampSelectBits(selectBits + delta)});
    };

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

             {/*Select-bit count controls*/}
            <div
                className="nodrag"
                style={{
                    position: 'absolute',
                    top: -22,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    fontSize: 10,
                }}
            >
                <button onClick={() => changeSelectBits(-1)} disabled={selectBits <= MIN_SELECT_BITS}>-</button>
                <span>{selectBits} sel</span>
                <button onClick={() => changeSelectBits(1)} disabled={selectBits >= MAX_SELECT_BITS}>+</button>
            </div>
        </div>
    );
}

export const Multiplexer: CircuitComponent = {
    evaluate: (node: Node) => {
        const data = node.data as MultiplexerProps;
        const selectBits = clampSelectBits(data.selectBits);

        let selectedIndex = 0;
        for (let i = 0; i < selectBits; i++) {
            if (getHandleState(node, {id: `s${i}`})) {
                selectedIndex |= (1 << i);
            }
        }

        const output = getHandleState(node, {id: `d${selectedIndex}`});
        setHandleOutputUpdate(node, "out", output);
    },

    component: MultiplexerNode,
}
