import {useCallback, useMemo, useState} from "react";
import {useNodesData, useOnSelectionChange, type Node, type NodeProps, type OnSelectionChangeParams} from "@xyflow/react";
import {componentRegistry, type ComponentType} from "@/components/ComponentRegistry.ts";
import {defaultConfigurators, type CircuitComponentData, type DataConfigurator} from "@/components/Component.tsx";
import "./PropertiesPanel.css";

export function PropertiesPanel() {
    const [selectedNodeId, setSelectedNodeId] = useState("");

    const onSelectionChange = useCallback(({nodes}: OnSelectionChangeParams) => {
        setSelectedNodeId(nodes[0]?.id ?? "");
    }, []);

    useOnSelectionChange({onChange: onSelectionChange});

    const node = useNodesData(selectedNodeId);

    const configurators: DataConfigurator[] = useMemo(() => {
        const component = node?.type && node.type in componentRegistry
            ? componentRegistry[node.type as ComponentType]
            : undefined;
        return [...defaultConfigurators, ...(component?.dataConfigurators ?? [])];
    }, [node?.type]);

    if (!node) {
        return (
            <div className="properties-panel properties-panel--empty">
                <span className="properties-panel__empty-text">No component selected</span>
            </div>
        );
    }

    const nodeProps: NodeProps<Node<CircuitComponentData>> = {
        id: node.id,
        type: node.type ?? "",
        data: (node.data ?? {}) as CircuitComponentData,
        selected: true,
        dragging: false,
        zIndex: 0,
        selectable: true,
        deletable: true,
        draggable: true,
        isConnectable: true,
        positionAbsoluteX: 0,
        positionAbsoluteY: 0
    };

    return (
        <div className="properties-panel">
            <div className="properties-panel__fields">
                {configurators.map(({displayName, component: Configurator}) => (
                    <div className="properties-panel__field" key={displayName}>
                        <label className="properties-panel__field-label">{displayName}</label>
                        <div className="properties-panel__field-control">
                            <Configurator {...nodeProps} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
