import { ReactNode } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { useDashboardContext } from "../context";

export const ButtonEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  children,
  source,
  target,
}: EdgeProps & { children: ReactNode }) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { selectedNode } = useDashboardContext();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        data-active-selection={`${selectedNode !== null}`}
        data-connected-to-selected={`${target === selectedNode?.id || source === selectedNode?.id}`}
        className="data-[active-selection=true]:data-[connected-to-selected=false]:!opacity-0 data-[active-selection=true]:data-[connected-to-selected=true]:!stroke-blue-500"
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute cursor-pointer"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {children}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
