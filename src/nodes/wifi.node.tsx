import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FaWifi } from "react-icons/fa";
import { MdPermScanWifi, MdWifiTethering } from "react-icons/md";
import { type WifiNode, Wifi } from "./types";
import { Tooltip } from "flowbite-react";

const WifiNodeIcon: React.FC<{ data: Wifi }> = ({ data }) => {
  if (data.hotspot) return <MdWifiTethering className="m-auto" />;
  if (data.probe) return <MdPermScanWifi className="m-auto" />;
  return <FaWifi className="m-auto" />;
};

export function WifiNode({ data }: NodeProps<WifiNode>) {
  return (
    <Tooltip
      content={`${data.essid === "" ? "(hidden)" : data.essid} \u200E-\u200E ${data.bssid && data.bssid !== "" ? data.bssid : "(unknown)"}`}
      className="text-sm text-nowrap"
    >
      <div className="flex size-fit rounded-lg border-1 border-black bg-white p-2 hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)]">
        <div className="m-auto flex gap-2">
          <WifiNodeIcon data={data} />
        </div>
        {data.incoming_relations > 0 && (
          <>
            {data.incoming_edges.map((edge) => (
              <Handle
                key={`${data.id}-${edge.source === data.id ? edge.target : edge.source}`}
                id={`${data.id}-${edge.source === data.id ? edge.target : edge.source}`}
                type="target"
                position={Position.Bottom}
              />
            ))}
          </>
        )}
        {data.outgoing_relations > 0 && (
          <>
            {data.outgoing_edges.map((edge) => (
              <Handle
                key={`${data.id}-${edge.source === data.id ? edge.target : edge.source}`}
                id={`${data.id}-${edge.source === data.id ? edge.target : edge.source}`}
                type="source"
                position={Position.Top}
              />
            ))}
          </>
        )}
      </div>
    </Tooltip>
  );
}
