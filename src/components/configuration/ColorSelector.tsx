import {type Node, type NodeProps, useReactFlow} from "@xyflow/react";
import type {CircuitComponentData} from "@/components/Component.tsx";
import type {LightData} from "@/components/output/Light.tsx";
import {MuiColorInput} from "mui-color-input";

export default function ColorSelector(props: NodeProps<Node<CircuitComponentData>>) {
    const {updateNodeData} = useReactFlow();
    const data = props?.data as LightData | undefined;
    const color = data?.color || "red";
    return <MuiColorInput value={color} format={"hex"} onChange={(value) => {
        updateNodeData(props.id, {color: value});
    }}/>;
}