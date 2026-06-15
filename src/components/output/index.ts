import Light from "@/components/output/Light.tsx";

export const Output = {
    LIGHT: "light",
} as const;

export type Output = typeof Output[keyof typeof Output];

export const outputTypes = {
    light: Light
}