import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";
import { createRef, useContext } from "react";
import { AppContext } from "../context";
import { AddWifiNodeComponent } from "./add-node";

export const AddNodeComponent = () => {
  const { showAddNode, setShowAddNode } = useContext(AppContext);
  const formRef = createRef<HTMLFormElement>();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <Modal show={showAddNode} onClose={() => setShowAddNode(false)}>
      <ModalHeader>Add New WiFi Node</ModalHeader>
        <ModalBody>
          <AddWifiNodeComponent formRef={formRef} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit}>Add Node</Button>
          <Button color="gray" onClick={() => setShowAddNode(false)}>
            Cancel
          </Button>
        </ModalFooter>
    </Modal>
  );
};
