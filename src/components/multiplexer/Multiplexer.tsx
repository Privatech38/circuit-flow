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

const ANGLE = 20; // degrees
const INPUT_SPACING = 12;
const VERTICAL_PADDING = 32;
const WIDTH = 50;

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

    const height = VERTICAL_PADDING * 2 + (numInputs - 1) * INPUT_SPACING;
    const heightDecrease = Math.tan((ANGLE / 180) * Math.PI) * WIDTH;
    const heightDecreasePercentage = heightDecrease * 100 / height;
    const changeSelectBits = (delta: number) => {
        if (!nodeId) return;
        updateNodeData(nodeId, {selectBits: clampSelectBits(selectBits + delta)});
    };

    return (
        <div style={{position: 'relative', width: WIDTH, height}}>
            <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} style={{display: 'block'}}>
                <polygon
                    points={`1,1 ${WIDTH - 1},${heightDecrease + 1} ${WIDTH - 1},${height - heightDecrease - 1} 1,${height - 1}`}
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
                    style={{top: `${((i + 0.5) / numInputs) * 100}%`}}
                />
            ))}

            {/* Select input handles */}
            {Array.from({length: selectBits}, (_, i) => {
                return (
                    <Handle
                        key={`s${i}`}
                        type="target"
                        position={Position.Bottom}
                        id={`s${i}`}
                        style={{
                            left: `${((i + 0.5) / selectBits) * 100}%`,
                            bottom: `${((i + 0.5) / selectBits) * heightDecreasePercentage}%`
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

            {/* Select-bit count controls */}
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
