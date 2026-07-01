import {ANDGate} from "./ANDGate.tsx";
import {OrGate} from "./OrGateNode.tsx";
import {XOrGate} from "./XOrGateNode.tsx";
import {NANDGate} from "./NANDGate.tsx";
import {NOrGate} from "./NORGateNode.tsx";
import {XNORGate} from "./XNORGateNode.tsx";
import {BufferGate} from "./BufferGate.tsx";
import {NotGate} from "./NotGateNode.tsx";

export const LogicGate = {
    BUFFER: "bufferGate",
    NOT: "notGate",
    AND: "andGate",
    NAND: "nandGate",
    OR: "orGate",
    NOR: "norGate",
    XOR: "xorGate",
    XNOR: "xnorGate",
} as const;

export type LogicGate = typeof LogicGate[keyof typeof LogicGate];

export const logicGateTypes = {
    bufferGate: BufferGate.component,
    notGate: NotGate.component,
    andGate: ANDGate.component,
    nandGate: NANDGate.component,
    orGate: OrGate.component,
    norGate: NOrGate.component,
    xorGate: XOrGate.component,
    xnorGate: XNORGate.component,
}

export const logicGates = {
    bufferGate: BufferGate,
    notGate: NotGate,
    andGate: ANDGate,
    nandGate: NANDGate,
    orGate: OrGate,
    norGate: NOrGate,
    xorGate: XOrGate,
    xnorGate: XNORGate,
}