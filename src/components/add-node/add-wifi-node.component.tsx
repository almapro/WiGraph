import { Button, HelperText, Label, TextInput, Tooltip } from "flowbite-react";
import { FC, Ref, useEffect, useState } from "react";
import _ from "lodash";
import { v4 } from "uuid";
import { FaEye, FaEyeSlash, FaWifi } from "react-icons/fa";
import { MdPermScanWifi, MdWifiTethering } from "react-icons/md";
import { useSnackbar } from "notistack";
import { useDashboardContext } from '../../context';
import { useReactFlow } from "@xyflow/react";
import { getNodes } from "../../neo4j";
import { PiPrinterFill } from "react-icons/pi";

export const AddWifiNodeComponent: FC<{ formRef: Ref<HTMLFormElement> }> = ({
  formRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { fitView, setNodes, setEdges } = useReactFlow();
  const { driver, setShowAddNode } = useDashboardContext();
  const [id, setId] = useState(v4());
  const [essid, setEssid] = useState("");
  const [bssid, setBssid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState("");
  const [probe, setProbe] = useState(false);
  const [hotspot, setHotspot] = useState(false);
  const [printer, setPrinter] = useState(false);
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
  const handleOnSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const session = driver.session();
    await session
      .run(
        `
        CREATE (n:Wifi {
          id: $id,
          essid: $essid,
          bssid: $bssid,
          probe: $probe,
          hotspot: $hotspot,
          printer: $printer,
          password: CASE WHEN $password = '' THEN null ELSE $password END,
          pin: CASE WHEN $pin = '' THEN null ELSE $pin END
        })
        `,
        {
          id,
          essid,
          bssid,
          probe,
          hotspot,
          printer,
          password,
          pin
        },
      )
      .then(async () => {
        enqueueSnackbar("Node added successfully", { variant: "success" });
        setShowAddNode(false);
        setId(v4());
        setEssid("");
        setBssid("");
        setPassword("");
        setShowPassword(false);
        setPin("");
        setProbe(false);
        setHotspot(false);
        session.close();
        await getNodes(driver, setNodes, setEdges, fitView);
      });
  };
  return (
    <form
      ref={formRef}
      onSubmit={handleOnSubmit}
      className="flex flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="essid">ESSID *</Label>
        </div>
        <TextInput
          required
          id="essid"
          placeholder="Wi-Fi Name"
          value={essid}
          onChange={(e) => setEssid(e.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="bssid">BSSID{probe ? "" : " *"}</Label>
        </div>
        <div className="flex gap-1">
          <TextInput
            required={!probe}
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
            required={!probe}
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
            required={!probe}
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
            required={!probe}
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
            required={!probe}
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
            required={!probe}
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
          onChange={(e) => setPin(e.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="type">Type</Label>
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
    </form>
  );
};
