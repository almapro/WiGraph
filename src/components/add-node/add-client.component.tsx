import { HelperText, Label, TextInput, Button, Tooltip } from "flowbite-react";
import { FC, Ref, useContext, useState } from "react";
import { v4 } from "uuid";
import { useSnackbar } from "notistack";
import { DashboardContext } from '../../context';
import { useReactFlow } from "@xyflow/react";
import { getNodes } from "../../neo4j";
import { FaDesktop, FaLaptop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
    
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

export const AddClientComponent: FC<{ formRef: Ref<HTMLFormElement> }> = ({
  formRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { fitView, setNodes, setEdges } = useReactFlow();
  const { driver, setShowAddNode, setShowAddType } = useContext(DashboardContext);
  const [client, setClient] = useState<ClientFormData>({
    id: v4(),
    name: "",
    macAddressParts: ["", "", "", "", "", ""],
    ipAddress: "",
    mobile: false,
    laptop: true,
    tablet: false,
    desktop: false
  });

  const handleMacAddressChange = (value: string, part: number) => {
    setClient({
      ...client,
      macAddressParts: client.macAddressParts.map((p, i) => i === part ? value : p)
    });
  };

  const handleOnSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    // Validate MAC address
    const macAddress = client.macAddressParts.join(":");
    if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress)) {
      enqueueSnackbar("Please enter a valid MAC address", { variant: "error" });
      return;
    }

    try {
      const session = driver.session();
      const query = `
        MERGE (c:Client {macAddress: $macAddress})
        ON CREATE SET 
          c.id = $id,
          c.name = $name,
          c.mobile = $mobile,
          c.laptop = $laptop,
          c.tablet = $tablet,
          c.desktop = $desktop
        ON MATCH SET
          c.name = $name
        WITH c
        FOREACH (_ IN CASE WHEN $ipAddress IS NOT NULL AND $ipAddress <> '' THEN [1] ELSE [] END |
          SET c.ipAddress = $ipAddress
        )
      `;

      await session.run(query, { 
        ...client,
        macAddress
      });

      enqueueSnackbar("Client added successfully", { variant: "success" });
      await getNodes(driver, setNodes, setEdges, fitView);
      setShowAddNode(false);
      setShowAddType("WIFI");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add client", { variant: "error" });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleOnSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Client Name</Label>
        <TextInput
          id="name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
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
              disabled={client.laptop}
              onClick={() => setClient({
                ...client,
                mobile: false,
                laptop: true,
                tablet: false,
                desktop: false
              })}
            >
              <FaLaptop className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Desktop">
            <Button
              size="sm"
              disabled={client.desktop}
              onClick={() => setClient({
                ...client,
                mobile: false,
                laptop: false,
                tablet: false,
                desktop: true
              })}
            >
              <FaDesktop className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Mobile Device">
            <Button
              size="sm"
              disabled={client.mobile}
              onClick={() => setClient({
                ...client,
                mobile: true,
                laptop: false,
                tablet: false,
                desktop: false
              })}
            >
              <FaMobileAlt className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Tablet">
            <Button
              size="sm"
              disabled={client.tablet}
              onClick={() => setClient({
                ...client,
                mobile: false,
                laptop: false,
                tablet: true,
                desktop: false
              })}
            >
              <FaTabletAlt className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="macAddress">MAC Address</Label>
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
        {!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(client.macAddressParts.join(":")) && client.macAddressParts.join("") !== "" && (
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
    </form>
  );
}; 