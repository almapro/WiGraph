import { Handle, Position, type NodeProps, useConnection } from "@xyflow/react";
import { FaWifi } from "react-icons/fa";
import { type NewWifiNode } from "./types";

export function NewWifiNode({  }: NodeProps<NewWifiNode>) {
    const connection = useConnection();
    const isPotentialSource = connection.inProgress && connection.toPosition === Position.Top && connection.fromNode?.type === "router";
    const isPotentialTarget = connection.inProgress && connection.toPosition === Position.Bottom && connection.fromNode?.type === "client";
  return (
    <div data-show={`${connection.inProgress}`} className="flex size-8 rounded-lg border-1 border-black bg-white p-2 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)] data-[show=true]:opacity-100 data-[show=false]:opacity-0">
      <div className="m-auto flex gap-2">
        <FaWifi className="m-auto" />
      </div>
      <Handle
        id="new-wifi-node-target"
        type="target"
        position={Position.Bottom}
        className={`${isPotentialTarget ? "" : "opacity-0"}`}
      />
      <Handle
        id="new-wifi-node-source"
        type="source"
        position={Position.Top}
        className={`${isPotentialSource ? "" : "opacity-0"}`}
      />
    </div>
  );
}
