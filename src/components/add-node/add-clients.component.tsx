import { HelperText, Label, Select, TextInput, Button, Tooltip } from "flowbite-react";
import { FC, Ref, useContext, useState } from "react";
import { v4 } from "uuid";
import { useSnackbar } from "notistack";
import { DashboardContext } from '../../context';
import { useReactFlow } from "@xyflow/react";
import { getNodes } from "../../neo4j";
import { WifiNode } from "../../nodes/types";
import { FaDesktop, FaLaptop, FaMobileAlt, FaPlus, FaTabletAlt, FaTrash } from "react-icons/fa";

interface ClientFormData {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  mobile: boolean;
  laptop: boolean;
  tablet: boolean;
  desktop: boolean;
}

export const AddClientsComponent: FC<{ formRef: Ref<HTMLFormElement> }> = ({
  formRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { getNodes: gNodes } = useReactFlow();
  const { fitView, setNodes, setEdges } = useReactFlow();
  const { driver, setShowAddNode } = useContext(DashboardContext);
  const [wifi, setWifi] = useState("");
  const [clients, setClients] = useState<ClientFormData[]>([{
    id: v4(),
    name: "",
    macAddress: "",
    ipAddress: "",
    mobile: false,
    laptop: true,
    tablet: false,
    desktop: false
  }]);

  const handleMacAddressChange = (index: number, value: string) => {
    const newClients = [...clients];
    newClients[index] = {
      ...newClients[index],
      macAddress: value
    };
    setClients(newClients);
  };

  const addClient = () => {
    setClients([...clients, {
      id: v4(),
      name: "",
      macAddress: "",
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
    const hasInvalidMac = clients.some(client => 
      !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(client.macAddress)
    );

    if (hasInvalidMac) {
      enqueueSnackbar("Please enter valid MAC addresses for all clients", { variant: "error" });
      return;
    }

    try {
      const session = driver.session();
      const query = `
        MATCH (w:Wifi {id: $wifi}) 
        UNWIND $clients AS client
        CREATE (c:Client {
          id: client.id, 
          name: client.name, 
          macAddress: client.macAddress,
          mobile: client.mobile,
          laptop: client.laptop,
          tablet: client.tablet,
          desktop: client.desktop
        })
        WITH c, w, client
        FOREACH (_ IN CASE WHEN client.ipAddress IS NOT NULL AND client.ipAddress <> '' THEN [1] ELSE [] END |
          SET c.ipAddress = client.ipAddress
        )
        FOREACH (_ IN CASE WHEN w.probe = true THEN [1] ELSE [] END |
          CREATE (c)-[:KNOWS]->(w)
        )
        FOREACH (_ IN CASE WHEN w.probe <> true THEN [1] ELSE [] END |
          CREATE (c)-[:CONNECTS_TO]->(w)
        )
      `;

      await session.run(query, { 
        wifi, 
        clients: clients.map(client => ({
          ...client,
          ipAddress: client.ipAddress || ''
        }))
      });

      enqueueSnackbar(`${clients.length} client(s) added successfully`, { variant: "success" });
      await getNodes(driver, setNodes, setEdges, fitView);
      setShowAddNode(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add clients", { variant: "error" });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleOnSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="wifi">Connect to WiFi</Label>
        <Select
          id="wifi"
          required
          onChange={(e) => setWifi(e.target.value)}
          value={wifi}
        >
          <option value="">Select a WiFi network</option>
          {gNodes()
            .filter((node): node is WifiNode => node.type === "wifi")
            .map((wifi) => (
              <option key={wifi.id} value={wifi.id}>
                {wifi.data.essid} ({wifi.data.bssid && wifi.data.bssid.length > 0 ? wifi.data.bssid : "unknown"})
              </option>
            ))}
        </Select>
      </div>

      {clients.map((client, index) => (
        <div key={client.id} className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Client {index + 1}</h3>
            {clients.length > 1 && (
              <Button color="red" size="xs" onClick={() => removeClient(index)}>
                <FaTrash className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`name-${index}`}>Client Name</Label>
            <TextInput
              id={`name-${index}`}
              value={client.name}
              onChange={(e) => {
                const newClients = [...clients];
                newClients[index] = { ...newClients[index], name: e.target.value };
                setClients(newClients);
              }}
              placeholder="Enter client name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Device Type</Label>
            <div className="flex gap-2">
              <Tooltip content="Laptop">
                <Button
                  size="sm" 
                  color={client.laptop ? "blue" : "gray"}
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
                  color={client.desktop ? "blue" : "gray"}
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
                  color={client.mobile ? "blue" : "gray"}
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
                  color={client.tablet ? "blue" : "gray"}
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
            <TextInput
              id={`macAddress-${index}`}
              value={client.macAddress}
              onChange={(e) => handleMacAddressChange(index, e.target.value)}
              placeholder="00:00:00:00:00:00"
              required
            />
            {!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(client.macAddress) && client.macAddress !== "" && (
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

      <Button type="button" onClick={addClient} className="flex items-center justify-center gap-2">
        <FaPlus className="w-4 h-4" />
        Add Another Client
      </Button>
    </form>
  );
}; 