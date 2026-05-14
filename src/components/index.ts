import AndGateNode from "./gates/AndGateNode.tsx";
import OrGateNode from "./gates/OrGateNode.tsx";
import XOrGateNode from "./gates/XOrGateNode.tsx";
import NAndGateNode from "./gates/NAndGateNode.tsx";
import NOrGateNode from "./gates/NORGateNode.tsx";
import XNORGateNode from "./gates/XNORGateNode.tsx";
import BufferGateNode from "./gates/BufferGateNode.tsx";
import NotGateNode from "./gates/NotGateNode.tsx";

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