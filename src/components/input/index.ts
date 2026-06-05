import Clock from "@/components/input/Clock.tsx"
import High from "@/components/input/High.tsx";
import Low from "@/components/input/Low.tsx";

export const Input = {
    CLOCK: "clock",
    HIGH: "high",
    LOW: "low",
} as const;

export type Input = typeof Input[keyof typeof Input];

export const inputTypes = {
    clock: Clock,
    high: High,
    low: Low
}