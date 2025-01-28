import { Tooltip } from "flowbite-react";

export const FloatingButtonComponent: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  tooltip: string;
  children?: React.ReactNode;
}> = ({ onClick, tooltip, children }) => {
  return (
    <Tooltip content={tooltip} placement="left">
      <button
        className="flex size-10 cursor-pointer rounded-full border-1 border-gray-500 bg-white p-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  );
};
