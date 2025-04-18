import { FC, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AppNode, ClientNode } from "../../nodes/types";
import { DashboardContext } from "../../context";

export const ClientContextMenu: FC<{ node: AppNode }> = ({ node }) => {
  const { setIsEditingNode, setIsDeletingNode, setActiveNode } = useContext(DashboardContext);

  const isClientNode = (node: AppNode): node is ClientNode => {
    return node.type === 'client';
  };

  if (!isClientNode(node)) return null;
  setActiveNode(node);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48">
      <div className="py-1">
        <button 
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          onClick={() => setIsEditingNode(true)}
        >
          <FaEdit className="w-4 h-4" />
          Edit Node
        </button>
        <button 
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          onClick={() => setIsDeletingNode(true)}
        >
          <FaTrash className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </div>
  );
};
