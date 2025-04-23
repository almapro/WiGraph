import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FaDesktop, FaLaptop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { type ClientNode } from "./types";
import { Tooltip } from "flowbite-react";
import { useDashboardContext } from "../context";

export function ClientNode({ data }: NodeProps<ClientNode>) {
  const {
    hoveringNode,
    dragging,
    dragIntersectingNodes,
    showAddType,
    selectedNode,
  } = useDashboardContext();
  const showHandles = hoveringNode?.id === data.id;
  const isDragIntersecting = dragIntersectingNodes.some(
    (node) => node.id === data.id,
  );
  return (
    <Tooltip
      content={`${data.name} \u200E-\u200E ${data.macAddress}`}
      className="text-sm text-nowrap"
    >
      <div
        data-active-selection={`${selectedNode !== null}`}
        data-selected={`${selectedNode?.id === data.id}`}
        data-connected-to-selected={`${data.outgoing_edges.some((edge) => edge.target === selectedNode?.id) || data.incoming_edges.some((edge) => edge.source === selectedNode?.id)}`}
        data-dragging={`${dragging}`}
        data-intersecting={`${isDragIntersecting}`}
        data-intersecting-compatible={`${showAddType === "WIFI" ? "true" : "false"}`}
        className="flex size-fit rounded-lg border-1 border-black bg-white p-2 hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] data-[dragging=true]:data-[intersecting=false]:data-[intersecting-compatible=false]:opacity-50 data-[dragging=true]:data-[intersecting=false]:data-[intersecting-compatible=true]:border-blue-500 data-[dragging=true]:data-[intersecting=true]:data-[intersecting-compatible=false]:border-red-500 data-[dragging=true]:data-[intersecting=true]:data-[intersecting-compatible=true]:border-green-500 data-[active-selection=true]:data-[selected=false]:data-[connected-to-selected=false]:opacity-50 data-[active-selection=true]:data-[selected=false]:data-[connected-to-selected=true]:border-blue-500 data-[selected=true]:border-blue-500 data-[active-selection=true]:data-[selected=true]:border-blue-500 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)]"
      >
        <div className="m-auto flex gap-2">
          {data.laptop && <FaLaptop className="m-auto" />}
          {data.tablet && <FaTabletAlt className="m-auto" />}
          {data.desktop && <FaDesktop className="m-auto" />}
          {data.mobile && <FaMobileAlt className="m-auto" />}
        </div>
        <Handle
          id={`${data.id}-target`}
          type="target"
          position={Position.Bottom}
          className={`${data.incoming_relations > 0 || showHandles ? "" : "opacity-0"}`}
        />
        <Handle
          id={`${data.id}-source`}
          type="source"
          position={Position.Top}
          className={`${data.outgoing_relations > 0 || showHandles ? "" : "opacity-0"}`}
        />
      </div>
    </Tooltip>
  );
}
