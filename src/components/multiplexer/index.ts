import {Multiplexer} from "@/components/multiplexer/Multiplexer.tsx";
import {Demultiplexer} from "@/components/multiplexer/Demultiplexer.tsx";
import type {CircuitComponentProps} from "@/components/Component.ts";
import type {Node} from "@xyflow/react";
import {getHandleState} from "@/simulation/ReactFlowUtils.ts";

export const MultiplexerType = {
    MUX: "multiplexer",
    DMUX: "demultiplexer",
} as const;

export type MultiplexerType = typeof MultiplexerType[keyof typeof MultiplexerType];

export const multiplexerTypes = {
    multiplexer: Multiplexer.component,
    demultiplexer: Demultiplexer.component,
}

// Common logic for multiplexer components

export type MultiplexerProps = CircuitComponentProps & {
    selectBits: number;
}

export const MIN_SELECT_BITS = 1;
export const MAX_SELECT_BITS = 4;
export const DEFAULT_SELECT_BITS = 2;

export const ANGLE = (20 / 180) * Math.PI; // 20 degrees in radians
export const INPUT_SPACING = 16;
export const VERTICAL_PADDING = 16;
export const MIN_WIDTH = 50;

export const HORIZONTAL_PADDING = VERTICAL_PADDING * Math.cos(ANGLE);
export const HORIZONTAL_SPACING = INPUT_SPACING * Math.cos(ANGLE);

export function clampSelectBits(value: number | undefined): number {
    if (value === undefined || Number.isNaN(value)) {
        return DEFAULT_SELECT_BITS;
    }
    return Math.min(MAX_SELECT_BITS, Math.max(MIN_SELECT_BITS, Math.round(value)));
}

export type MuxLayout = {
    width: number;
    height: number;
    heightDecrease: number;
    heightDecreasePercentage: number;
    horizontalPaddingPercentage: number;
    horizontalInputPercentage: number;
    inputPaddingPercentage: number;
    inputPercentage: number;
}

export function computeMuxLayout(selectBits: number, numInputs: number): MuxLayout {
    const width = Math.max(MIN_WIDTH, HORIZONTAL_PADDING * 2 + (selectBits - 1) * HORIZONTAL_SPACING);
    const horizontalPaddingPercentage = (width > MIN_WIDTH ? HORIZONTAL_PADDING : (MIN_WIDTH - (selectBits - 1) * HORIZONTAL_SPACING) / 2) / width * 100;
    const horizontalInputPercentage = 100 - 2 * horizontalPaddingPercentage;

    const height = VERTICAL_PADDING * 2 + (numInputs - 1) * INPUT_SPACING;
    const heightDecrease = Math.tan(ANGLE) * width;
    const heightDecreasePercentage = heightDecrease * 100 / height;

    const inputPaddingPercentage = VERTICAL_PADDING / height * 100;
    const inputPercentage = 100 - 2 * inputPaddingPercentage;

    return {
        width,
        height,
        heightDecrease,
        heightDecreasePercentage,
        horizontalPaddingPercentage,
        horizontalInputPercentage,
        inputPaddingPercentage,
        inputPercentage,
    };
}

export function getSelectedIndex(node: Node, selectBits: number): number {
    let selectedIndex = 0;
    for (let i = 0; i < selectBits; i++) {
        if (getHandleState(node, {id: `s${i}`})) {
            selectedIndex |= (1 << i);
        }
    }
    return selectedIndex;
}
