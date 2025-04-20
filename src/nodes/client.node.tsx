import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FaDesktop, FaLaptop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { type ClientNode } from "./types";
import { Tooltip } from "flowbite-react";
import { useDashboardContext } from "../context";

export function ClientNode({ data }: NodeProps<ClientNode>) {
    const { hoveringNode } = useDashboardContext();
    const showHandles = hoveringNode?.id === data.id;
  return (
    <Tooltip
      content={`${data.name} \u200E-\u200E ${data.macAddress}`}
      className="text-sm text-nowrap"
    >
      <div className="flex size-fit rounded-lg border-1 border-black bg-white p-2 hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)]">
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
