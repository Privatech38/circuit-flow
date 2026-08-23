import { getSmoothStepPath, BaseEdge, type EdgeProps, type Edge } from '@xyflow/react';
import { useEffect } from 'react';
import {getNodeOutputState, updateEdgeStyle} from "@/simulation/WireManager.ts";

type PoweredEdge = Edge<Record<string, never>>

export function PoweredEdge({id, sourceX, sourceY, targetX, targetY, source, sourceHandleId}: EdgeProps<PoweredEdge>) {
    const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

    useEffect(() => {
        const nodeOutputState = getNodeOutputState({ id: source });
        updateEdgeStyle({ id: id }, sourceHandleId ? nodeOutputState.has(sourceHandleId) : nodeOutputState.size > 0)
    }, [id, source, sourceHandleId]);

    return <BaseEdge id={id} path={edgePath} />;
}