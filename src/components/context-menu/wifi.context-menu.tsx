import { FC, useEffect } from "react";
import { FaWifi, FaLaptop, FaEdit, FaTrash } from "react-icons/fa";
import { WifiNode } from "../../nodes";
import { useDashboardContext } from "../../context";

export const WifiContextMenu: FC<{ node: WifiNode }> = ({ node }) => {
  const {
    setShowConvertingToWifi,
    setShowAddingClientsToWifi,
    setShowEditingNode,
    setShowDeleteNode,
    setActiveNode,
  } = useDashboardContext();
  useEffect(() => {
    setActiveNode(node);
  }, [node]);
  return (
    <div className="w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="py-1">
        {node.data.probe && (
          <button
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => setShowConvertingToWifi(true)}
          >
            <FaWifi className="h-4 w-4" />
            Convert to WiFi
          </button>
        )}
        {(node.data.hotspot || !node.data.probe) && (
          <button
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => setShowAddingClientsToWifi(true)}
          >
            <FaLaptop className="h-4 w-4" />
            Add Clients
          </button>
        )}
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
