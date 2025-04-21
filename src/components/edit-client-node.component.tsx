import { Button, HelperText, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput, Tooltip } from "flowbite-react";
import { useState } from "react";
import { useDashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { useReactFlow } from "@xyflow/react";
import { enqueueSnackbar } from "notistack";
import { FaLaptop } from "react-icons/fa";
import { FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { FaDesktop } from "react-icons/fa";

interface ClientFormData {
    id: string;
    name: string;
    macAddressParts: string[];
    ipAddress: string;
    mobile: boolean;
    laptop: boolean;
    tablet: boolean;
    desktop: boolean;
  }

export const EditClientNodeComponent = () => {
  const { driver, showEditingNode, setShowEditingNode, activeNode, setActiveNode } = useDashboardContext();
  if (!activeNode || activeNode.type !== "client") return null;
  const { setNodes, setEdges, fitView } = useReactFlow();
    const [client, setClient] = useState<ClientFormData>({
        id: activeNode.id,
        name: activeNode.data.name || "",
        macAddressParts: activeNode.data.macAddress.split(":"),
        ipAddress: activeNode.data.ip || "",
        mobile: activeNode.data.mobile || false,
        laptop: activeNode.data.laptop || false,
        tablet: activeNode.data.tablet || false,
        desktop: activeNode.data.desktop || false
    });

  const handleSubmit = async () => {
    try {
      const session = driver.session();
      await session.run(`
        MATCH (c:Client {id: $nodeId})
        SET c.name = $name, c.macAddress = $macAddress, c.ipAddress = $ipAddress, c.mobile = $mobile, c.laptop = $laptop, c.tablet = $tablet, c.desktop = $desktop
      `, { 
        nodeId: activeNode.id,
        name: client.name,
        macAddress: client.macAddressParts.join(":"),
        ipAddress: client.ipAddress,
        mobile: client.mobile,
        laptop: client.laptop,
        tablet: client.tablet,
        desktop: client.desktop
      });
      await session.close();
      enqueueSnackbar("Client node updated successfully", { variant: "success" });
      setShowEditingNode(false);
      await getNodes(driver, setNodes, setEdges, fitView);
      setClient({
        id: activeNode.id,
        name: "",
        macAddressParts: ["", "", "", "", "", ""],
        ipAddress: "",
        mobile: false,
        laptop: false,
        tablet: false,
        desktop: false
      });
      setActiveNode(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to update client node", { variant: "error" });
    }
  };

  const handleCancel = () => {
    setShowEditingNode(false);
    setClient({
      id: activeNode.id,
      name: "",
      macAddressParts: ["", "", "", "", "", ""],
      ipAddress: "",
      mobile: false,
      laptop: false,
      tablet: false,
      desktop: false
    });
    setActiveNode(null);
  };

  const handleMacAddressChange = (value: string, part: number) => {
    setClient({
      ...client,
      macAddressParts: client.macAddressParts.map((p, i) => i === part ? value : p)
    });
  };
  return (
    <Modal show={showEditingNode} onClose={handleCancel}>
      <ModalHeader>Edit Client Node</ModalHeader>
      <ModalBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Client Name *</Label>
            <TextInput
              id="name"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Device Type *</Label>
            <div className="flex gap-2">
              <Tooltip content="Laptop">
                <Button
                  size="sm" 
                  disabled={client.laptop}
                  onClick={() => setClient({ ...client, laptop: true, tablet: false, desktop: false, mobile: false })}
                >
                  <FaLaptop className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Desktop">
                <Button
                  size="sm"
                  disabled={client.desktop}
                  onClick={() => setClient({ ...client, desktop: true, laptop: false, tablet: false, mobile: false })}
                >
                  <FaDesktop className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Mobile Device">
                <Button
                  size="sm"
                  disabled={client.mobile}
                  onClick={() => setClient({ ...client, mobile: true, laptop: false, desktop: false, tablet: false })}
                >
                  <FaMobileAlt className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Tablet">
                <Button
                  size="sm"
                  disabled={client.tablet}
                  onClick={() => setClient({ ...client, tablet: true, laptop: false, desktop: false, mobile: false })}
                >
                  <FaTabletAlt className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="macAddress">MAC Address *</Label>
            <div className="flex gap-1">
              <TextInput
                id="macAddress-1"
                value={client.macAddressParts[0]}
                maxLength={2}
                onChange={(e) => {
                  handleMacAddressChange(e.target.value, 0);
                  if (e.target.value.length === 2) {
                    const nextInput = document.getElementById('macAddress-2') as HTMLInputElement | null;
                    if (nextInput) {
                      nextInput.focus();
                      nextInput.setSelectionRange(0, nextInput.value.length);
                    }
                  }
                }}
                placeholder="XX"
                required
              />
              <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
              <TextInput
                id="macAddress-2"
                value={client.macAddressParts[1]}
                maxLength={2}
                onChange={(e) => {
                  handleMacAddressChange(e.target.value, 1);
                  if (e.target.value === '' && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById('macAddress-1') as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                    }
                  }
                  if (e.target.value.length === 2) {
                    const nextInput = document.getElementById('macAddress-3') as HTMLInputElement | null;
                    if (nextInput) {
                      nextInput.focus();
                      nextInput.setSelectionRange(0, nextInput.value.length);
                    }
                  }
                }}
                placeholder="XX"
                required
              />
              <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
              <TextInput
                id="macAddress-3"
                value={client.macAddressParts[2]}
                maxLength={2}
                onChange={(e) => {
                  handleMacAddressChange(e.target.value, 2);
                  if (e.target.value === '' && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById('macAddress-2') as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                    }
                  }
                  if (e.target.value.length === 2) {
                    const nextInput = document.getElementById('macAddress-4') as HTMLInputElement | null;
                    if (nextInput) {
                      nextInput.focus();
                      nextInput.setSelectionRange(0, nextInput.value.length);
                    }
                  }
                }}
                placeholder="XX"
                required
              />
              <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
              <TextInput
                id="macAddress-4"
                value={client.macAddressParts[3]}
                maxLength={2}
                onChange={(e) => {
                  handleMacAddressChange(e.target.value, 3);
                  if (e.target.value === '' && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById('macAddress-3') as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                    }
                  }
                  if (e.target.value.length === 2) {
                    const nextInput = document.getElementById('macAddress-5') as HTMLInputElement | null;
                    if (nextInput) {
                      nextInput.focus();
                      nextInput.setSelectionRange(0, nextInput.value.length);
                    }
                  }
                }}
                placeholder="XX"
                required
              />
              <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
              <TextInput
                id="macAddress-5"
                value={client.macAddressParts[4]}
                maxLength={2}
                onChange={(e) => {
                  handleMacAddressChange(e.target.value, 4);
                  if (e.target.value === '' && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById('macAddress-4') as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                    }
                  }
                  if (e.target.value.length === 2) {
                    const nextInput = document.getElementById('macAddress-6') as HTMLInputElement | null;
                    if (nextInput) {
                      nextInput.focus();
                      nextInput.setSelectionRange(0, nextInput.value.length);
                    }
                  }
                }}
                placeholder="XX"
                required
              />
              <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
              <TextInput
                id="macAddress-6"
                value={client.macAddressParts[5]}
                maxLength={2}
                onChange={(e) => {
                  handleMacAddressChange(e.target.value, 5);
                  if (e.target.value === '' && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById('macAddress-5') as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                    }
                  }
                }}
                placeholder="XX"
                required
              />
            </div>
            {!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(client.macAddressParts.join(":")) && client.macAddressParts.join(":") !== "" && (
              <HelperText color="failure">
                Please enter a valid MAC address (format: 00:00:00:00:00:00)
              </HelperText>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ipAddress">IP Address</Label>
            <TextInput
              id="ipAddress"
              value={client.ipAddress}
              onChange={(e) => setClient({ ...client, ipAddress: e.target.value })}
              placeholder="192.168.1.100"
            />
          </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSubmit}>Save Changes</Button>
        <Button color="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
