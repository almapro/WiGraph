import { FC, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ClientNode } from "../../nodes";
import { useDashboardContext } from "../../context";

export const ClientContextMenu: FC<{ node: ClientNode }> = ({ node }) => {
  const { setShowEditingNode, setShowDeleteNode, setActiveNode } =
    useDashboardContext();
  useEffect(() => {
    setActiveNode(node);
  }, [node]);

  return (
    <div className="w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="py-1">
        <button
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          onClick={() => setShowEditingNode(true)}
        >
          <FaEdit className="h-4 w-4" />
          Edit Node
        </button>
        <button
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          onClick={() => setShowDeleteNode(true)}
        >
          <FaTrash className="h-4 w-4" />
          Delete Node
        </button>
      </div>
    </div>
  );
};
