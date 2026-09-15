import {type Node, type NodeProps, useReactFlow} from "@xyflow/react";
import NumberSpinner from "@/reactComponents/NumberSpinner.tsx";
import type {CircuitComponentData} from "@/components/Component.tsx";
import type {ClockData} from "@/components/input/Clock.tsx";

export default function FrequencySelector(props: NodeProps<Node<CircuitComponentData>>) {
    const {updateNodeData} = useReactFlow();
    const data = props?.data as ClockData | undefined;
    const frequency = data?.frequency || 1;
    return <NumberSpinner min={0.000001} max={1000.0} size={"small"} defaultValue={frequency}
                          onValueChange={(value) => {
                              updateNodeData(props.id, {frequency: value});
                          }}/>;
}