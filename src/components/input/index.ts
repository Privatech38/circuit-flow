import {Clock} from "@/components/input/Clock.tsx";
import {High} from "@/components/input/High.tsx";
import {Low} from "@/components/input/Low.tsx";
import {Button} from "@/components/input/Button.tsx";
import {Switch} from "@/components/input/Switch.tsx";

export const Input = {
    CLOCK: "clock",
    HIGH: "high",
    LOW: "low",
    BUTTON: "button",
    SWITCH: "switch",
} as const;

export type Input = typeof Input[keyof typeof Input];

export const inputTypes = {
    clock: Clock.component,
    high: High.component,
    low: Low.component,
    button: Button.component,
    switch: Switch.component,
}