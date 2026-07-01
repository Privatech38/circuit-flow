import {ANDGate} from "./ANDGate.tsx";
import OrGateNode from "./OrGateNode.tsx";
import XOrGateNode from "./XOrGateNode.tsx";
import NAndGateNode from "./NANDGate.tsx";
import NOrGateNode from "./NORGateNode.tsx";
import XNORGateNode from "./XNORGateNode.tsx";
import {BufferGate} from "./BufferGate.tsx";
import NotGateNode from "./NotGateNode.tsx";

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
    notGate: NotGateNode,
    andGate: ANDGate.component,
    nandGate: NAndGateNode,
    orGate: OrGateNode,
    norGate: NOrGateNode,
    xorGate: XOrGateNode,
    xnorGate: XNORGateNode,
}

export const logicGates = {
    bufferGate: BufferGate,
    andGate: ANDGate
}