import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";
import { DashboardContext } from '../context';
import { useContext } from "react";
import { useReactFlow } from "@xyflow/react";
import { deleteNode } from "../neo4j";
import { useSnackbar } from "notistack";

export const DeleteNodeComponent = () => {
  const { isDeletingNode, setIsDeletingNode, driver, activeNode } = useContext(DashboardContext);
  const { setNodes } = useReactFlow();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => { 
    if (!activeNode) return;
    try {
      await deleteNode(driver, activeNode);
      setNodes(nodes => nodes.filter(n => n.id !== activeNode.id));
      enqueueSnackbar("Node deleted successfully", { variant: "success" });
      setIsDeletingNode(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete node", { variant: "error" });
    }
  };

  return (
    <Modal show={isDeletingNode} onClose={() => setIsDeletingNode(false)}>
      <ModalHeader>Delete Node</ModalHeader>
      <ModalBody>
        <div className="text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this node? This action cannot be undone.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="red" onClick={handleDelete}>Delete</Button>
        <Button color="gray" onClick={() => setIsDeletingNode(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
