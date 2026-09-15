import {useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import type {CircuitComponentData} from "@/components/Component.tsx";
import {Input} from "@mui/material";

export function LabelField(props: NodeProps<Node<CircuitComponentData>>) {
    const {updateNodeData} = useReactFlow();
    const data = props?.data as CircuitComponentData | undefined;
    return (
        <Input id="label"
               value={data?.label || ""}
               onChange={(e) => {
                   updateNodeData(props.id, {label: e.target.value});
               }}/>
    );
}
