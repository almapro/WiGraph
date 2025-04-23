import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useDashboardContext } from "../context";
import { useReactFlow } from "@xyflow/react";
import { getNodes } from "../neo4j";
import { useSnackbar } from "notistack";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

export const DeleteRelationComponent = () => {
  const {
    showDeleteRelation,
    setShowDeleteRelation,
    driver,
    relationToDelete,
    setRelationToDelete,
  } = useDashboardContext();
  const { fitView } = useReactFlow();
  const { setNodes, setEdges } = useStore(
    useShallow((s) => ({
      setNodes: s.setNodes,
      setEdges: s.setEdges,
    })),
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      const session = driver.session();
      await session.run(
        `
        MATCH (a)-[r]-(b)
        WHERE a.id = $node1Id AND b.id = $node2Id
        DELETE r
      `,
        {
          node1Id: relationToDelete?.source,
          node2Id: relationToDelete?.target,
        },
      );
      await session.close();
      await getNodes(driver, setNodes, setEdges, fitView);
      enqueueSnackbar("Relation deleted successfully", { variant: "success" });
      setShowDeleteRelation(false);
      setRelationToDelete(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete relation", { variant: "error" });
    }
  };

  const handleCancel = () => {
    setShowDeleteRelation(false);
    setRelationToDelete(null);
  };

  return (
    <Modal show={showDeleteRelation} onClose={handleCancel}>
      <ModalHeader>Delete Relation</ModalHeader>
      <ModalBody>
        <div className="text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this relation? This action cannot be
          undone.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
        <Button color="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
