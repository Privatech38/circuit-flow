import {SRLatch} from "@/components/latches/SRLatch.tsx";

export const Latch = {
    SR_LATCH: "sr_latch",
} as const;

export type Input = typeof Latch[keyof typeof Latch];

export const latches = {
    sr_latch: SRLatch,
}

export const latchTypes = {
    sr_latch: SRLatch.component,
}