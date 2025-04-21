import { Button, HelperText, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { useReactFlow } from "@xyflow/react";
import { enqueueSnackbar } from "notistack";
import { WifiNode } from "../nodes/types";

export const ConvertToWifiComponent = () => {
  const { driver, showConvertingToWifi, setShowConvertingToWifi, activeNode, setActiveNode } = useDashboardContext();
  const { setNodes, setEdges, fitView } = useReactFlow();
  const [bssid, setBssid] = useState("");
  const [bssidError, setBssidError] = useState(false);
  const [bssidPart1, setBssidPart1] = useState("");
  const [bssidPart2, setBssidPart2] = useState("");
  const [bssidPart3, setBssidPart3] = useState("");
  const [bssidPart4, setBssidPart4] = useState("");
  const [bssidPart5, setBssidPart5] = useState("");
  const [bssidPart6, setBssidPart6] = useState("");
  useEffect(() => {
    let value = `${bssidPart1}:${bssidPart2}:${bssidPart3}:${bssidPart4}:${bssidPart5}:${bssidPart6}`;
    if (value.replaceAll(":", "").length === 0) {
      setBssidError(false);
      setBssid("");
      return;
    }
    const isValid = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(value);
    setBssidError(!isValid);
    setBssid(value);
  }, [bssidPart1, bssidPart2, bssidPart3, bssidPart4, bssidPart5, bssidPart6]);

  const handleSubmit = async () => {
    if (!activeNode || !bssid) return;
    try {
        const session = driver.session();
        await session.run(`
            MATCH (w:Wifi {id: $nodeId})
            SET w.probe = false, w.bssid = $bssid
            WITH w
            MATCH (c:Client)-[r]->(w)
            WHERE TYPE(r) <> 'CONNECTS_TO'
            DELETE r
            CREATE (c)-[:CONNECTS_TO]->(w)
            `,
            { nodeId: activeNode.id, bssid });
        await session.close();
        enqueueSnackbar("Probe converted to WiFi", { variant: "success" });
        setShowConvertingToWifi(false);
        setBssidPart1("");
        setBssidPart2("");
        setBssidPart3("");
        setBssidPart4("");
        setBssidPart5("");
        setBssidPart6("");
        await getNodes(driver, setNodes, setEdges, fitView);
        setActiveNode(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to convert probe to WiFi", { variant: "error" });
    }
  };
  const handleCancel = () => {
    setShowConvertingToWifi(false);
    setBssidPart1("");
    setBssidPart2("");
    setBssidPart3("");
    setBssidPart4("");
    setBssidPart5("");
    setBssidPart6("");
    setActiveNode(null);
  }

  return (
    <Modal show={showConvertingToWifi} onClose={handleCancel}>
        <ModalHeader>Convert Probe to WiFi: <i>{(activeNode as WifiNode | null)?.data.essid} - (unknown)</i></ModalHeader>
        <ModalBody>
        <div>
        <div className="mb-2 block">
          <Label htmlFor="bssid">BSSID *</Label>
        </div>
        <div className="flex gap-1">
          <TextInput
            required
            id="bssid-1"
            placeholder="XX"
            value={bssidPart1}
            maxLength={2}
            className="w-12"
            color={bssidError ? "failure" : "gray"}
            onChange={(e) => {
              const val = e.target.value;
              setBssidPart1(val);
              if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                const nextInput = document.getElementById('bssid-2');
                nextInput?.focus();
              }
            }}
          />
          <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
          <TextInput
            required
            id="bssid-2" 
            placeholder="XX"
            value={bssidPart2}
            maxLength={2}
            className="w-12"
            color={bssidError ? "failure" : "gray"}
            onChange={(e) => {
              if (e.target.value === '' && e.target.selectionStart === 0) {
                const prevInput = document.getElementById('bssid-1') as HTMLInputElement | null;
                if (prevInput) {
                  prevInput.focus();
                  prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                }
              }
              const val = e.target.value;
              setBssidPart2(val);
              if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                const nextInput = document.getElementById('bssid-3');
                nextInput?.focus();
              }
            }}
          />
          <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
          <TextInput
            required
            id="bssid-3"
            placeholder="XX"
            value={bssidPart3}
            maxLength={2}
            className="w-12"
            color={bssidError ? "failure" : "gray"}
            onChange={(e) => {
              if (e.target.value === '' && e.target.selectionStart === 0) {
                const prevInput = document.getElementById('bssid-2') as HTMLInputElement | null;
                if (prevInput) {
                  prevInput.focus();
                  prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                }
              }
              const val = e.target.value;
              setBssidPart3(val);
              if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                const nextInput = document.getElementById('bssid-4');
                nextInput?.focus();
              }
            }}
          />
          <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
          <TextInput
            required
            id="bssid-4"
            placeholder="XX"
            value={bssidPart4}
            maxLength={2}
            className="w-12"
            color={bssidError ? "failure" : "gray"}
            onChange={(e) => {
              if (e.target.value === '' && e.target.selectionStart === 0) {
                const prevInput = document.getElementById('bssid-3') as HTMLInputElement | null;
                if (prevInput) {
                  prevInput.focus();
                  prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                }
              }
              const val = e.target.value;
              setBssidPart4(val);
              if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                const nextInput = document.getElementById('bssid-5');
                nextInput?.focus();
              }
            }}
          />
          <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
          <TextInput
            required
            id="bssid-5"
            placeholder="XX"
            value={bssidPart5}
            maxLength={2}
            className="w-12"
            color={bssidError ? "failure" : "gray"}
            onChange={(e) => {
              if (e.target.value === '' && e.target.selectionStart === 0) {
                const prevInput = document.getElementById('bssid-4') as HTMLInputElement | null;
                if (prevInput) {
                  prevInput.focus();
                  prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                }
              }
              const val = e.target.value;
              setBssidPart5(val);
              if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                const nextInput = document.getElementById('bssid-6');
                nextInput?.focus();
              }
            }}
          />
          <span className="flex items-center text-gray-500 dark:text-gray-400 text-lg">:</span>
          <TextInput
            required
            id="bssid-6"
            placeholder="XX"
            value={bssidPart6}
            maxLength={2}
            className="w-12"
            color={bssidError ? "failure" : "gray"}
            onChange={(e) => {
              if (e.target.value === '' && e.target.selectionStart === 0) {
                const prevInput = document.getElementById('bssid-5') as HTMLInputElement | null;
                if (prevInput) {
                  prevInput.focus();
                  prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                }
              }
              setBssidPart6(e.target.value);
            }}
          />
        </div>
        <HelperText
          color={bssidError ? "failure" : "gray"}
        >
          {bssidError ? "BSSID must be formatted properly" : ""}
        </HelperText>
      </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} disabled={!bssid}>Convert</Button>
          <Button color="gray" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
    </Modal>
  );
};

