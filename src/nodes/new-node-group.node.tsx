import { useConnection, type NodeProps } from "@xyflow/react";
import { type NewNodeGroupNode } from "./types";

export function NewNodeGroupNode({}: NodeProps<NewNodeGroupNode>) {
    const connection = useConnection();
    const isShown = connection.inProgress;
  return (
    <div data-show={`${isShown}`} className="h-12 w-22 rounded-lg border-1 border-black bg-transparent dark:border-zinc-700 dark:text-white data-[show=true]:opacity-100 data-[show=false]:opacity-0"></div>
  );
}
