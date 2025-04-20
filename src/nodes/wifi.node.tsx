import { Handle, Position, type NodeProps, useConnection } from "@xyflow/react";
import { FaWifi } from "react-icons/fa";
import { MdPermScanWifi, MdWifiTethering } from "react-icons/md";
import { PiPrinterFill } from "react-icons/pi";
import { type WifiNode, Wifi } from "./types";
import { Tooltip } from "flowbite-react";
import { useDashboardContext } from "../context";

const WifiNodeIcon: React.FC<{ data: Wifi }> = ({ data }) => {
  if (data.printer) return <PiPrinterFill className="m-auto" />;
  if (data.hotspot) return <MdWifiTethering className="m-auto" />;
  if (data.probe) return <MdPermScanWifi className="m-auto" />;
  return <FaWifi className="m-auto" />;
};

export function WifiNode({ data }: NodeProps<WifiNode>) {
  const { hoveringNode, reconnecting, dragIntersectingNodes, showAddType, dragging } = useDashboardContext();
  const connection = useConnection();
  const potinationalTarget = !reconnecting && connection.inProgress && connection.toPosition === Position.Bottom && connection.fromNode?.type === "client";
  const potinationalSource = !reconnecting && connection.inProgress && connection.toPosition === Position.Top && connection.fromNode?.type === "router" && !data.probe && !data.hotspot;
  const showHandles = hoveringNode?.id === data.id;
  const isDragIntersecting = dragIntersectingNodes.some((node) => node.id === data.id);
  return (
    <Tooltip
      content={`${data.essid === "" ? "(hidden)" : data.essid} \u200E-\u200E ${data.bssid && data.bssid !== "" ? data.bssid : "(unknown)"}`}
      className="text-sm text-nowrap"
    >
      <div data-dragging={`${dragging}`} data-intersecting={`${isDragIntersecting}`} data-intersecting-compatible={`${showAddType === "CLIENT" ? "true" : "false"}`} className="flex size-fit rounded-lg border-1 border-black bg-white p-2 hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)] data-[dragging=true]:data-[intersecting=true]:data-[intersecting-compatible=true]:border-green-500 data-[dragging=true]:data-[intersecting=true]:data-[intersecting-compatible=false]:border-red-500 data-[dragging=true]:data-[intersecting-compatible=true]:border-blue-500 data-[dragging=true]:data-[intersecting-compatible=false]:opacity-50">
        <div className="m-auto flex gap-2">
          <WifiNodeIcon data={data} />
        </div>
       <Handle
          id={`${data.id}-target`}
          type="target"
          position={Position.Bottom}
          className={`${data.incoming_relations > 0 || potinationalTarget || showHandles ? "" : "opacity-0"}`}
          />
        <Handle
            id={`${data.id}-source`}
            type="source"
            position={Position.Top}
            className={`${!data.probe && (data.outgoing_relations > 0 || potinationalSource || showHandles) ? "" : "opacity-0"}`}
          />
      </div>
    </Tooltip>
  );
}
