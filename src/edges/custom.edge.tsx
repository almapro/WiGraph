import { EdgeProps } from "@xyflow/react";
import { memo } from "react";
import { ButtonEdge } from "./button.edge";

export const CustomEdge = memo((props: EdgeProps) => {
  return (
    <ButtonEdge {...props}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-1 opacity-0 duration-200 hover:opacity-100">
        <div
          className={`rounded-md border-1 border-black bg-white p-1 text-[8px] text-gray-600 dark:border-zinc-700 dark:bg-neutral-800 dark:text-gray-400`}
        >
          {typeof props.data?.label === "string"
            ? props.data.label
            : "CONNECTS_TO"}
        </div>
      </div>
    </ButtonEdge>
  );
});
