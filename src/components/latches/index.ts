import {SRLatch} from "@/components/latches/SRLatch.tsx";
import {DFlipFlop} from "@/components/latches/DFlipFlop.tsx";
import {JKFlipFlop} from "@/components/latches/JKFlipFlop.tsx";
import {TFlipFlop} from "@/components/latches/TFlipFlop.tsx";

export const Latch = {
    SR_LATCH: "sr_latch",
    D_FLIP_FLOP: "d_flip_flop",
    JK_FLIP_FLOP: "jk_flip_flop",
    T_FLIP_FLOP: "t_flip_flop",
} as const;

export type Latch = typeof Latch[keyof typeof Latch];

export const latches = {
    sr_latch: SRLatch,
    d_flip_flop: DFlipFlop,
    jk_flip_flop: JKFlipFlop,
    t_flip_flop: TFlipFlop,
}

export const latchTypes = {
    sr_latch: SRLatch.component,
    d_flip_flop: DFlipFlop.component,
    jk_flip_flop: JKFlipFlop.component,
    t_flip_flop: TFlipFlop.component,
}