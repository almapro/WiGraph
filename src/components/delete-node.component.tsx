import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";
import { DashboardContext } from '../context';
import { useContext } from "react";
import { useReactFlow } from "@xyflow/react";
import { deleteNode, getNodes } from "../neo4j";
import { useSnackbar } from "notistack";

export const DeleteNodeComponent = () => {
  const { showDeleteNode, setShowDeleteNode, driver, activeNode } = useContext(DashboardContext);
  const { setNodes, setEdges, fitView } = useReactFlow();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => { 
    if (!activeNode) return;
    try {
        await deleteNode(driver, activeNode);
        await getNodes(driver, setNodes, setEdges, fitView);
        enqueueSnackbar("Node deleted successfully", { variant: "success" });
        setShowDeleteNode(false);
    } catch (error) {
        console.error(error);
        enqueueSnackbar("Failed to delete node", { variant: "error" });
    }
  };

  return (
    <Modal show={showDeleteNode} onClose={() => setShowDeleteNode(false)}>
      <ModalHeader>Delete Node</ModalHeader>
      <ModalBody>
        <div className="text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this node? This action cannot be undone.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="red" onClick={handleDelete}>Delete</Button>
        <Button color="gray" onClick={() => setShowDeleteNode(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
