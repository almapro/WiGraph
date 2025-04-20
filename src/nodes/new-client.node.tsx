import { Handle, Position, type NodeProps, useConnection } from "@xyflow/react";
import { FaLaptop } from "react-icons/fa";
import { type NewClientNode } from "./types";

export function NewClientNode({}: NodeProps<NewClientNode>) {
    const connection = useConnection();
    const isPotentialSource = connection.inProgress && connection.fromNode?.type === "wifi";
    const isPotentialTarget = connection.inProgress && connection.fromNode?.type === "service";

    return (
        <div data-show={`${connection.inProgress}`} className="flex size-8 rounded-lg border-1 border-black bg-white p-2 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)] data-[show=true]:opacity-100 data-[show=false]:opacity-0">
            <div className="m-auto flex gap-2">
                <FaLaptop className="m-auto" />
            </div>
            <Handle
                id="new-client-node-target"
                type="target"
                position={Position.Top}
                className={`${isPotentialTarget ? "" : "opacity-0"}`}
            />
            <Handle
                id="new-client-node-source"
                type="source"
                position={Position.Bottom}
                className={`${isPotentialSource ? "" : "opacity-0"}`}
            />
        </div>
    );
}
