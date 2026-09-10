import {SRLatch} from "@/components/latches/SRLatch.tsx";
import {DFlipFlop} from "@/components/latches/DFlipFlop.tsx";

export const Latch = {
    SR_LATCH: "sr_latch",
    D_FLIP_FLOP: "d_flip_flop",
} as const;

export type Latch = typeof Latch[keyof typeof Latch];

export const latches = {
    sr_latch: SRLatch,
    d_flip_flop: DFlipFlop,
}

export const latchTypes = {
    sr_latch: SRLatch.component,
    d_flip_flop: DFlipFlop.component,
}