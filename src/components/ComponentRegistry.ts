import {BufferGate} from "@/components/gates/BufferGate.tsx";
import {NotGate} from "@/components/gates/NotGateNode.tsx";
import {ANDGate} from "@/components/gates/ANDGate.tsx";
import {NANDGate} from "@/components/gates/NANDGate.tsx";
import {OrGate} from "@/components/gates/OrGateNode.tsx";
import {NOrGate} from "@/components/gates/NORGateNode.tsx";
import {XOrGate} from "@/components/gates/XOrGateNode.tsx";
import {XNORGate} from "@/components/gates/XNORGateNode.tsx";
import {Clock} from "@/components/input/Clock.tsx";
import {High} from "@/components/input/High.tsx";
import {Low} from "@/components/input/Low.tsx";
import {Light} from "@/components/output/Light.tsx";

export const componentRegistry = {
    // Gates
    bufferGate: BufferGate,
    notGate: NotGate,
    andGate: ANDGate,
    nandGate: NANDGate,
    orGate: OrGate,
    norGate: NOrGate,
    xorGate: XOrGate,
    xnorGate: XNORGate,
    // Input
    clock: Clock,
    high: High,
    low: Low,
    // Output
    light: Light,
}

export type ComponentType = keyof typeof componentRegistry;