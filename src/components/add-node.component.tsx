import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Tooltip } from "flowbite-react";
import { createRef, useContext } from "react";
import { DashboardContext } from "../context";
import { AddClientComponent, AddWifiNodeComponent } from "./add-node";
import { FaLaptop, FaWifi } from "react-icons/fa";

export const AddNodeComponent = () => {
  const { showAddNode, setShowAddNode, showAddType, setShowAddType } = useContext(DashboardContext);
  const formRef = createRef<HTMLFormElement>();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleCancel = () => {
    setShowAddNode(false);
    setShowAddType("WIFI");
  };

  return (
    <Modal show={showAddNode} onClose={handleCancel}>
      <ModalHeader>Add New Node</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Tooltip content="Wifi">
              <Button disabled={showAddType === "WIFI"} onClick={() => setShowAddType("WIFI")} className="flex">
                <FaWifi className="w-4 h-4 m-auto" />
              </Button>
            </Tooltip>
            <Tooltip content="Client">
              <Button disabled={showAddType === "CLIENT"} onClick={() => setShowAddType("CLIENT")} className="flex">
                <FaLaptop className="w-4 h-4 m-auto" />
              </Button>
            </Tooltip>
          </div>
          {showAddType === "WIFI" && (
            <AddWifiNodeComponent formRef={formRef} />
          )}
          {showAddType === "CLIENT" && (
            <AddClientComponent formRef={formRef} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit}>Add Node</Button>
          <Button color="gray" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
    </Modal>
  );
};
