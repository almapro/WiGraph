import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Tooltip } from "flowbite-react";
import { createRef, useContext, useState } from "react";
import { DashboardContext } from "../context";
import { AddClientsComponent, AddWifiNodeComponent } from "./add-node";
import { FaLaptop, FaWifi } from "react-icons/fa";

export const AddNodeComponent = () => {
  const { showAddNode, setShowAddNode } = useContext(DashboardContext);
  const formRef = createRef<HTMLFormElement>();
  const [showAddType, setShowAddType] = useState<"wifi" | "client">("wifi");

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleCancel = () => {
    setShowAddNode(false);
    setShowAddType("wifi");
  };

  return (
    <Modal show={showAddNode} onClose={handleCancel}>
      <ModalHeader>Add New Node</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Tooltip content="Add a new WiFi access point or probe">
              <Button disabled={showAddType === "wifi"} onClick={() => setShowAddType("wifi")} className={`flex ${showAddType === "wifi" ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400" : ""}`}>
                <FaWifi className="w-4 h-4 m-auto" />
              </Button>
            </Tooltip>
            <Tooltip content="Add a new client device">
              <Button disabled={showAddType === "client"} onClick={() => setShowAddType("client")} className={`flex ${showAddType === "client" ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400" : ""}`}>
                <FaLaptop className="w-4 h-4 m-auto" />
              </Button>
            </Tooltip>
          </div>
          {showAddType === "wifi" && (
            <AddWifiNodeComponent formRef={formRef} />
          )}
          {showAddType === "client" && (
            <AddClientsComponent formRef={formRef} />
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
