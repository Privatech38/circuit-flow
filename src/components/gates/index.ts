import AndGateNode from "./AndGateNode.tsx";
import OrGateNode from "./OrGateNode.tsx";
import XOrGateNode from "./XOrGateNode.tsx";
import NAndGateNode from "./NAndGateNode.tsx";
import NOrGateNode from "./NORGateNode.tsx";
import XNORGateNode from "./XNORGateNode.tsx";
import BufferGateNode from "./BufferGateNode.tsx";
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
    bufferGate: BufferGateNode,
    notGate: NotGateNode,
    andGate: AndGateNode,
    nandGate: NAndGateNode,
    orGate: OrGateNode,
    norGate: NOrGateNode,
    xorGate: XOrGateNode,
    xnorGate: XNORGateNode,
}