import {
  Button,
  HelperText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { useReactFlow } from "@xyflow/react";
import { enqueueSnackbar } from "notistack";
import { PiPrinterFill } from "react-icons/pi";
import { MdPermScanWifi, MdWifiTethering } from "react-icons/md";
import { FaWifi, FaEye, FaEyeSlash } from "react-icons/fa";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

export const EditWifiNodeComponent = () => {
  const {
    driver,
    showEditingNode,
    setShowEditingNode,
    activeNode,
    setActiveNode,
  } = useDashboardContext();
  const { fitView } = useReactFlow();
  const { setNodes, setEdges } = useStore(
    useShallow((s) => ({
      setNodes: s.setNodes,
      setEdges: s.setEdges,
    })),
  );
  const [essid, setEssid] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.essid : "",
  );
  const [bssid, setBssid] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.bssid : "",
  );
  const [bssidError, setBssidError] = useState(false);
  const [bssidPart1, setBssidPart1] = useState(
    activeNode && activeNode.type === "wifi"
      ? activeNode.data.bssid.split(":").length > 0
        ? activeNode.data.bssid.split(":")[0]
        : ""
      : "",
  );
  const [bssidPart2, setBssidPart2] = useState(
    activeNode && activeNode.type === "wifi"
      ? activeNode.data.bssid.split(":").length > 1
        ? activeNode.data.bssid.split(":")[1]
        : ""
      : "",
  );
  const [bssidPart3, setBssidPart3] = useState(
    activeNode && activeNode.type === "wifi"
      ? activeNode.data.bssid.split(":").length > 2
        ? activeNode.data.bssid.split(":")[2]
        : ""
      : "",
  );
  const [bssidPart4, setBssidPart4] = useState(
    activeNode && activeNode.type === "wifi"
      ? activeNode.data.bssid.split(":").length > 3
        ? activeNode.data.bssid.split(":")[3]
        : ""
      : "",
  );
  const [bssidPart5, setBssidPart5] = useState(
    activeNode && activeNode.type === "wifi"
      ? activeNode.data.bssid.split(":").length > 4
        ? activeNode.data.bssid.split(":")[4]
        : ""
      : "",
  );
  const [bssidPart6, setBssidPart6] = useState(
    activeNode && activeNode.type === "wifi"
      ? activeNode.data.bssid.split(":").length > 5
        ? activeNode.data.bssid.split(":")[5]
        : ""
      : "",
  );
  const [password, setPassword] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.password : "",
  );
  const [pin, setPin] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.pin : "",
  );
  const [probe, setProbe] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.probe : false,
  );
  const [hotspot, setHotspot] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.hotspot : false,
  );
  const [printer, setPrinter] = useState(
    activeNode && activeNode.type === "wifi" ? activeNode.data.printer : false,
  );
  const [showPassword, setShowPassword] = useState(false);

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

  if (!activeNode || activeNode.type !== "wifi") return null;

  const handleSubmit = async () => {
    try {
      const session = driver.session();
      await session.run(
        `
        MATCH (w:Wifi {id: $nodeId})
        SET w.essid = $essid, w.bssid = $bssid, w.password = $password, w.pin = $pin, w.probe = $probe, w.hotspot = $hotspot, w.printer = $printer
      `,
        {
          nodeId: activeNode.id,
          essid,
          bssid: probe ? "" : bssid,
          password,
          pin,
          probe,
          hotspot,
          printer,
        },
      );
      await session.close();
      enqueueSnackbar("WiFi node updated successfully", { variant: "success" });
      setShowEditingNode(false);
      await getNodes(driver, setNodes, setEdges, fitView);
      setEssid("");
      setBssidPart1("");
      setBssidPart2("");
      setBssidPart3("");
      setBssidPart4("");
      setBssidPart5("");
      setBssidPart6("");
      setPassword("");
      setPin("");
      setProbe(false);
      setHotspot(false);
      setPrinter(false);
      setShowPassword(false);
      setActiveNode(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to update WiFi node", { variant: "error" });
    }
  };

  const handleCancel = () => {
    setShowEditingNode(false);
    setEssid("");
    setBssidPart1("");
    setBssidPart2("");
    setBssidPart3("");
    setBssidPart4("");
    setBssidPart5("");
    setBssidPart6("");
    setPassword("");
    setPin("");
    setProbe(false);
    setHotspot(false);
    setPrinter(false);
    setShowPassword(false);
    setActiveNode(null);
  };

  return (
    <Modal show={showEditingNode} onClose={handleCancel}>
      <ModalHeader>Edit WiFi Node</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="essid">ESSID *</Label>
            </div>
            <TextInput
              id="essid"
              required
              placeholder="ESSID"
              value={essid}
              onChange={(e) => setEssid(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="type">Type *</Label>
            </div>
            <div className="flex gap-2">
              <Tooltip content="WiFi" placement="bottom">
                <Button
                  disabled={!probe && !hotspot && !printer}
                  className="flex size-12 w-full"
                  onClick={() => {
                    setProbe(false);
                    setHotspot(false);
                    setPrinter(false);
                  }}
                >
                  <FaWifi className="m-auto" />
                </Button>
              </Tooltip>
              <Tooltip content="Probe" placement="bottom">
                <Button
                  className="flex size-12 w-full"
                  disabled={probe}
                  onClick={() => {
                    setProbe(true);
                    setHotspot(false);
                    setPrinter(false);
                  }}
                >
                  <MdPermScanWifi className="m-auto" />
                </Button>
              </Tooltip>
              <Tooltip content="Hotspot" placement="bottom">
                <Button
                  className="flex size-12 w-full"
                  disabled={hotspot}
                  onClick={() => {
                    setProbe(false);
                    setHotspot(true);
                    setPrinter(false);
                  }}
                >
                  <MdWifiTethering className="m-auto" />
                </Button>
              </Tooltip>
              <Tooltip content="Printer" placement="bottom">
                <Button
                  className="flex size-12 w-full"
                  disabled={printer}
                  onClick={() => {
                    setProbe(false);
                    setHotspot(false);
                    setPrinter(true);
                  }}
                >
                  <PiPrinterFill className="m-auto" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bssid">BSSID{probe ? "" : " *"}</Label>
            </div>
            <div className="flex gap-1">
              <TextInput
                required={!probe}
                disabled={probe}
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
                    const nextInput = document.getElementById("bssid-2");
                    nextInput?.focus();
                  }
                }}
              />
              <span className="flex items-center text-lg text-gray-500 dark:text-gray-400">
                :
              </span>
              <TextInput
                required={!probe}
                disabled={probe}
                id="bssid-2"
                placeholder="XX"
                value={bssidPart2}
                maxLength={2}
                className="w-12"
                color={bssidError ? "failure" : "gray"}
                onChange={(e) => {
                  if (e.target.value === "" && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById(
                      "bssid-1",
                    ) as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(
                        prevInput.value.length,
                        prevInput.value.length,
                      );
                    }
                  }
                  const val = e.target.value;
                  setBssidPart2(val);
                  if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                    const nextInput = document.getElementById("bssid-3");
                    nextInput?.focus();
                  }
                }}
              />
              <span className="flex items-center text-lg text-gray-500 dark:text-gray-400">
                :
              </span>
              <TextInput
                required={!probe}
                disabled={probe}
                id="bssid-3"
                placeholder="XX"
                value={bssidPart3}
                maxLength={2}
                className="w-12"
                color={bssidError ? "failure" : "gray"}
                onChange={(e) => {
                  if (e.target.value === "" && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById(
                      "bssid-2",
                    ) as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(
                        prevInput.value.length,
                        prevInput.value.length,
                      );
                    }
                  }
                  const val = e.target.value;
                  setBssidPart3(val);
                  if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                    const nextInput = document.getElementById("bssid-4");
                    nextInput?.focus();
                  }
                }}
              />
              <span className="flex items-center text-lg text-gray-500 dark:text-gray-400">
                :
              </span>
              <TextInput
                required={!probe}
                disabled={probe}
                id="bssid-4"
                placeholder="XX"
                value={bssidPart4}
                maxLength={2}
                className="w-12"
                color={bssidError ? "failure" : "gray"}
                onChange={(e) => {
                  if (e.target.value === "" && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById(
                      "bssid-3",
                    ) as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(
                        prevInput.value.length,
                        prevInput.value.length,
                      );
                    }
                  }
                  const val = e.target.value;
                  setBssidPart4(val);
                  if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                    const nextInput = document.getElementById("bssid-5");
                    nextInput?.focus();
                  }
                }}
              />
              <span className="flex items-center text-lg text-gray-500 dark:text-gray-400">
                :
              </span>
              <TextInput
                required={!probe}
                disabled={probe}
                id="bssid-5"
                placeholder="XX"
                value={bssidPart5}
                maxLength={2}
                className="w-12"
                color={bssidError ? "failure" : "gray"}
                onChange={(e) => {
                  if (e.target.value === "" && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById(
                      "bssid-4",
                    ) as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(
                        prevInput.value.length,
                        prevInput.value.length,
                      );
                    }
                  }
                  const val = e.target.value;
                  setBssidPart5(val);
                  if (/^[0-9A-Fa-f]{2}$/.test(val)) {
                    const nextInput = document.getElementById("bssid-6");
                    nextInput?.focus();
                  }
                }}
              />
              <span className="flex items-center text-lg text-gray-500 dark:text-gray-400">
                :
              </span>
              <TextInput
                required={!probe}
                disabled={probe}
                id="bssid-6"
                placeholder="XX"
                value={bssidPart6}
                maxLength={2}
                className="w-12"
                color={bssidError ? "failure" : "gray"}
                onChange={(e) => {
                  if (e.target.value === "" && e.target.selectionStart === 0) {
                    const prevInput = document.getElementById(
                      "bssid-5",
                    ) as HTMLInputElement | null;
                    if (prevInput) {
                      prevInput.focus();
                      prevInput.setSelectionRange(
                        prevInput.value.length,
                        prevInput.value.length,
                      );
                    }
                  }
                  setBssidPart6(e.target.value);
                }}
              />
            </div>
            <HelperText color={bssidError ? "failure" : "gray"}>
              {bssidError ? "BSSID must be formatted properly" : ""}
            </HelperText>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="flex gap-2">
              <TextInput
                className="grow"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                id="password"
                minLength={8}
                value={password}
                disabled={probe}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="flex"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="m-auto" />
                ) : (
                  <FaEye className="m-auto" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="pin">WPS PIN</Label>
            </div>
            <TextInput
              id="pin"
              type="number"
              minLength={8}
              placeholder="12345678"
              value={pin}
              disabled={probe}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSubmit} disabled={!essid || bssidError}>
          Save
        </Button>
        <Button color="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
