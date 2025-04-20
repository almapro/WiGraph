import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../context";
import { useSnackbar } from "notistack";
import { getNodes } from "../neo4j";
import { useReactFlow, Node } from "@xyflow/react";

export const AddRelationComponent = () => {
  const { 
    driver,
    showAddRelation,
    setShowAddRelation,
    relationToAdd,
    setRelationToAdd
  } = useDashboardContext();
  const { setNodes, setEdges } = useReactFlow();
  const { enqueueSnackbar } = useSnackbar();
  const { fitView, getNode, getEdges } = useReactFlow();
  const [sourceNode, setSourceNode] = useState<Node | undefined>(undefined);
  const [targetNode, setTargetNode] = useState<Node | undefined>(undefined);

  useEffect(() => {
    if (relationToAdd) {
      const sourceNode = getNode(relationToAdd.source);
      const targetNode = getNode(relationToAdd.target);
      setSourceNode(sourceNode);
      setTargetNode(targetNode);
      const edges = getEdges();
      const existingEdge = edges.find(
        edge => edge.source === relationToAdd.source && edge.target === relationToAdd.target
      );
      
      if (existingEdge) {
        enqueueSnackbar("A relation already exists between these nodes", { variant: "warning" });
        setShowAddRelation(false);
        setRelationToAdd(null);
        return;
      }
    }
  }, [relationToAdd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationToAdd) return;

    try {
      const session = driver.session();
      const query = `
        MATCH (source) WHERE source.id = $sourceId
        MATCH (target) WHERE target.id = $targetId
        MERGE (source)-[:${targetNode?.type === 'wifi' && sourceNode?.type === 'client' && targetNode?.data.probe ? 'KNOWS' : 'CONNECTS_TO'}]->(target)
      `;

      await session.run(query, {
        sourceId: relationToAdd.source,
        targetId: relationToAdd.target
      });

      await getNodes(driver, setNodes, setEdges, fitView);
      enqueueSnackbar("Relation added successfully", { variant: "success" });
      setShowAddRelation(false);
      setRelationToAdd(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add relation", { variant: "error" });
    }
  };

  return (
    <Modal
      show={showAddRelation}
      onClose={() => {
        setShowAddRelation(false);
        setRelationToAdd(null);
      }}
    >
      <ModalHeader>Add Relation</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>From Node</Label>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {sourceNode?.type === 'client' ? (
                  `${sourceNode?.data.name} (${sourceNode?.data.macAddress})`
                ) : sourceNode?.type === 'wifi' ? (
                  `${sourceNode?.data.essid} (${sourceNode?.data.bssid || 'unknown'})`
                ) : sourceNode?.id}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>To Node</Label>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {targetNode?.type === 'client' ? (
                  `${targetNode?.data.name} (${targetNode?.data.macAddress})`
                ) : targetNode?.type === 'wifi' ? (
                  `${targetNode?.data.essid} (${targetNode?.data.bssid || 'unknown'})`
                ) : targetNode?.id}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Relation Type</Label>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {(() => {
                  if ((sourceNode?.type === 'wifi' && targetNode?.type === 'client') ||
                      (sourceNode?.type === 'client' && targetNode?.type === 'wifi')) {
                    const wifiNode = sourceNode?.type === 'wifi' ? sourceNode : targetNode;
                    if (wifiNode?.data.probe) {
                      return 'KNOWS';
                    }
                    return 'CONNECTS_TO';
                  }
                  return 'CONNECTED_TO';
                })()}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full gap-2">
            <Button type="submit" color="blue">
              Add
            </Button>
            <Button
              color="gray"
              onClick={() => {
                setShowAddRelation(false);
                setRelationToAdd(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
