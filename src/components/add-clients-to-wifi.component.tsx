import { HelperText, Label, TextInput, Button, Tooltip, Modal, ModalFooter, ModalHeader, ModalBody } from "flowbite-react";
import { useContext, useState } from "react";
import { v4 } from "uuid";
import { useSnackbar } from "notistack";
import { DashboardContext } from '../context/';
import { useReactFlow } from "@xyflow/react";
import { getNodes } from "../neo4j";
import { FaDesktop, FaLaptop, FaMobileAlt, FaPlus, FaTabletAlt, FaTrash } from "react-icons/fa";
import { WifiNode } from "../nodes/types";

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

export const AddClientsToWifiComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { fitView, setNodes, setEdges } = useReactFlow();
  const { driver, setShowAddingClientsToWifi, showAddingClientsToWifi, activeNode, setActiveNode } = useContext(DashboardContext);
  const [clients, setClients] = useState<ClientFormData[]>([{
    id: v4(),
    name: "",
    macAddressParts: ["", "", "", "", "", ""],
    ipAddress: "",
    mobile: false,
    laptop: true,
    tablet: false,
    desktop: false
  }]);

  const handleMacAddressChange = (index: number, value: string, part: number) => {
    const newClients = [...clients];
    newClients[index] = {
      ...newClients[index],
      macAddressParts: newClients[index].macAddressParts.map((p, i) => i === part ? value : p)
    };
    setClients(newClients);
  };

  const addClient = () => {
    setClients([...clients, {
      id: v4(),
      name: "",
      macAddressParts: ["", "", "", "", "", ""],
      ipAddress: "",
      mobile: false,
      laptop: true,
      tablet: false,
      desktop: false
    }]);
  };

  const removeClient = (index: number) => {
    if (clients.length > 1) {
      setClients(clients.filter((_, i) => i !== index));
    }
  };

  const handleOnSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    // Validate all MAC addresses
    // Check for duplicate MAC addresses within the form
    const macAddresses = clients.map(c => c.macAddressParts.join(":").toLowerCase());
    const hasDuplicates = macAddresses.length !== new Set(macAddresses).size;
    if (hasDuplicates) {
      enqueueSnackbar("Duplicate MAC addresses found", { variant: "error" });
      return;
    }

    const hasInvalidMac = clients.some(client => 
      !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(client.macAddressParts.join(":"))
    );

    if (hasInvalidMac) {
      enqueueSnackbar("Please enter valid MAC addresses for all clients", { variant: "error" });
      return;
    }

    try {
      const session = driver.session();
      const query = `
        MATCH (w:Wifi {id: $wifiId})
        UNWIND $clients AS client
        MERGE (c:Client {macAddress: client.macAddress})
        ON CREATE SET 
          c.id = client.id,
          c.name = client.name,
          c.mobile = client.mobile,
          c.laptop = client.laptop,
          c.tablet = client.tablet,
          c.desktop = client.desktop
        ON MATCH SET
          c.name = client.name
        WITH c, w, client
        FOREACH (_ IN CASE WHEN client.ipAddress IS NOT NULL AND client.ipAddress <> '' THEN [1] ELSE [] END |
          SET c.ipAddress = client.ipAddress
        )
        FOREACH (_ IN CASE WHEN w.probe = true THEN [1] ELSE [] END |
          MERGE (c)-[:KNOWS]->(w)
        )
        FOREACH (_ IN CASE WHEN w.probe <> true THEN [1] ELSE [] END |
          MERGE (c)-[:CONNECTS_TO]->(w)
        )
      `;

      await session.run(query, { 
        wifiId: activeNode?.id, 
        clients: clients.map(client => ({
          ...client,
          macAddress: client.macAddressParts.join(":"),
          ipAddress: client.ipAddress || ''
        }))
      });

      enqueueSnackbar(`${clients.length} client(s) added successfully`, { variant: "success" });
      await getNodes(driver, setNodes, setEdges, fitView);
      setShowAddingClientsToWifi(false);
      setActiveNode(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add clients", { variant: "error" });
    }
  };
  const handleClose = () => {
    setShowAddingClientsToWifi(false);
    setActiveNode(null);
    setClients([{
      id: v4(),
      name: "",
      macAddressParts: ["", "", "", "", "", ""],
      ipAddress: "",
      mobile: false,
      laptop: true,
      tablet: false,
      desktop: false
    }]);
  }

  return (
    <Modal show={showAddingClientsToWifi} onClose={handleClose}>
        <form onSubmit={handleOnSubmit}>
        <ModalHeader>Add Clients to <i>{(activeNode as WifiNode | null)?.data.essid} - {(activeNode as WifiNode | null)?.data.bssid}</i></ModalHeader>
        <ModalBody>
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                
                {clients.map((client, index) => (

                    <div key={client.id} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                        
                        {clients.length > 1 && (
                            <div className="flex w-full justify-center">
                                <Tooltip content="Remove Client">
                                    <FaTrash onClick={() => removeClient(index)} className="w-4 h-4 text-red-500" />
                                </Tooltip>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 flex-grow">
                            <Label htmlFor={`name-${index}`}>Name</Label>
                            <TextInput
                                id={`name-${index}`}
                                value={client.name}
                                onChange={(e) => {
                                const newClients = [...clients];
                                newClients[index] = { ...newClients[index], name: e.target.value };
                                setClients(newClients);
                                }}
                                placeholder="Client Name"
                                required
                            />
                        </div>
                        
                                    
                    <div className="flex flex-col gap-2">
                        <Label>Device Type</Label>
                        <div className="flex gap-2">
                            <Tooltip content="Laptop">
                            <Button
                                size="sm"
                                disabled={client.laptop}
                                onClick={() => {
                                const newClients = [...clients];
                                newClients[index] = {
                                    ...newClients[index],
                                    mobile: false,
                                    laptop: true,
                                    tablet: false,
                                    desktop: false
                                };
                                setClients(newClients);
                                }}
                            >
                                <FaLaptop className="w-4 h-4" />
                            </Button>
                            </Tooltip>
                            <Tooltip content="Desktop">
                            <Button
                                size="sm"
                                disabled={client.desktop}
                                onClick={() => {
                                const newClients = [...clients];
                                newClients[index] = {
                                    ...newClients[index],
                                    mobile: false,
                                    laptop: false,
                                    tablet: false,
                                    desktop: true
                                };
                                setClients(newClients);
                                }}
                            >
                                <FaDesktop className="w-4 h-4" />
                            </Button>
                            </Tooltip>
                            <Tooltip content="Mobile Device">
                            <Button
                                size="sm"
                                disabled={client.mobile}
                                onClick={() => {
                                const newClients = [...clients];
                                newClients[index] = { 
                                    ...newClients[index], 
                                    mobile: true,
                                    laptop: false,
                                    tablet: false,
                                    desktop: false
                                };
                                setClients(newClients);
                                }}
                            >
                                <FaMobileAlt className="w-4 h-4" />
                            </Button>
                            </Tooltip>
                            <Tooltip content="Tablet">
                            <Button
                                size="sm"
                                disabled={client.tablet}
                                onClick={() => {
                                const newClients = [...clients];
                                newClients[index] = {
                                    ...newClients[index],
                                    mobile: false,
                                    laptop: false,
                                    tablet: true,
                                    desktop: false
                                };
                                setClients(newClients);
                                }}
                            >
                                <FaTabletAlt className="w-4 h-4" />
                            </Button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor={`macAddress-${index}`}>MAC Address</Label>
                        <div className="flex gap-1">
                        <TextInput
                            id={`macAddress-${index}-1`}
                            value={client.macAddressParts[0]}
                            maxLength={2}
                            onChange={(e) => {
                            handleMacAddressChange(index, e.target.value, 0);
                            if (e.target.value.length === 2) {
                                const nextInput = document.getElementById(`macAddress-${index}-2`) as HTMLInputElement | null;
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
                            id={`macAddress-${index}-2`}
                            value={client.macAddressParts[1]}
                            maxLength={2}
                            onChange={(e) => {
                            handleMacAddressChange(index, e.target.value, 1);
                            if (e.target.value === '' && e.target.selectionStart === 0) {
                                const prevInput = document.getElementById(`macAddress-${index}-1`) as HTMLInputElement | null;
                                if (prevInput) {
                                prevInput.focus();
                                prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                                }
                            }
                            if (e.target.value.length === 2) {
                                const nextInput = document.getElementById(`macAddress-${index}-3`) as HTMLInputElement | null;
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
                            id={`macAddress-${index}-3`}
                            value={client.macAddressParts[2]}
                            maxLength={2}
                            onChange={(e) => {
                            handleMacAddressChange(index, e.target.value, 2);
                            if (e.target.value === '' && e.target.selectionStart === 0) {
                                const prevInput = document.getElementById(`macAddress-${index}-2`) as HTMLInputElement | null;
                                if (prevInput) {
                                prevInput.focus();
                                prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                                }
                            }
                            if (e.target.value.length === 2) {
                                const nextInput = document.getElementById(`macAddress-${index}-4`) as HTMLInputElement | null;
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
                            id={`macAddress-${index}-4`}
                            value={client.macAddressParts[3]}
                            maxLength={2}
                            onChange={(e) => {
                            handleMacAddressChange(index, e.target.value, 3);
                            if (e.target.value === '' && e.target.selectionStart === 0) {
                                const prevInput = document.getElementById(`macAddress-${index}-3`) as HTMLInputElement | null;
                                if (prevInput) {
                                prevInput.focus();
                                prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                                }
                            }
                            if (e.target.value.length === 2) {
                                const nextInput = document.getElementById(`macAddress-${index}-5`) as HTMLInputElement | null;
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
                            id={`macAddress-${index}-5`}
                            value={client.macAddressParts[4]}
                            maxLength={2}
                            onChange={(e) => {
                            handleMacAddressChange(index, e.target.value, 4);
                            if (e.target.value === '' && e.target.selectionStart === 0) {
                                const prevInput = document.getElementById(`macAddress-${index}-4`) as HTMLInputElement | null;
                                if (prevInput) {
                                prevInput.focus();
                                prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                                }
                            }
                            if (e.target.value.length === 2) {
                                const nextInput = document.getElementById(`macAddress-${index}-6`) as HTMLInputElement | null;
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
                            id={`macAddress-${index}-6`}
                            value={client.macAddressParts[5]}
                            maxLength={2}
                            onChange={(e) => {
                            handleMacAddressChange(index, e.target.value, 5);
                            if (e.target.value === '' && e.target.selectionStart === 0) {
                                const prevInput = document.getElementById(`macAddress-${index}-5`) as HTMLInputElement | null;
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
                        {!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(client.macAddressParts.join(":")) && client.macAddressParts.join("") !== "" && (
                        <HelperText color="failure">
                            Please enter a valid MAC address (format: 00:00:00:00:00:00)
                        </HelperText>
                        )}
                    </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor={`ipAddress-${index}`}>IP Address</Label>
                    <TextInput
                    id={`ipAddress-${index}`}
                    value={client.ipAddress}
                    onChange={(e) => {
                        const newClients = [...clients];
                        newClients[index] = { ...newClients[index], ipAddress: e.target.value };
                        setClients(newClients);
                    }}
                    placeholder="192.168.1.100"
                    />
                </div>
                </div>
                ))}
            </div>
            <Button type="button" onClick={addClient} className="flex items-center justify-center gap-2 w-full mt-4">
                <FaPlus className="w-4 h-4" />
                Add Another Client
            </Button>
        </ModalBody>
        <ModalFooter>
            <Button type="submit">
                Add Clients
            </Button>
            <Button color="gray" onClick={handleClose}>
                Cancel
            </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
