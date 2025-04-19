import { Button, HelperText, Label, TextInput, Tooltip } from "flowbite-react";
import { FC, Ref, useContext, useState } from "react";
import _ from "lodash";
import { v4 } from "uuid";
import { FaEye, FaEyeSlash, FaWifi } from "react-icons/fa";
import { MdPermScanWifi, MdWifiTethering } from "react-icons/md";
import { useSnackbar } from "notistack";
import { DashboardContext } from '../../context';
import { useReactFlow } from "@xyflow/react";
import { getNodes } from "../../neo4j";
import { PiPrinterFill } from "react-icons/pi";

export const AddWifiNodeComponent: FC<{ formRef: Ref<HTMLFormElement> }> = ({
  formRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { fitView, setNodes, setEdges } = useReactFlow();
  const { driver, setShowAddNode } = useContext(DashboardContext);
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
  const handleBssidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBssidError(
      !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(e.target.value),
    );
    setBssid(e.target.value);
  };
  const handleOnSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const session = driver.session();
    await session
      .run(
        `CREATE (n:Wifi { id: $id, essid: $essid, bssid: $bssid, probe: $probe, hotspot: $hotspot, printer: $printer${password !== "" ? ", password: $password" : ""}${pin !== "" ? ", pin: $pin" : ""} })`,
        _.assign(
          {},
          { id, essid, bssid, probe, hotspot, printer },
          password !== "" ? { password } : {},
          pin !== "" ? { pin } : {},
        ),
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
        <TextInput
          required={!probe}
          id="bssid"
          placeholder="XX:XX:XX:XX:XX:XX"
          value={bssid}
          color={bssidError ? "failure" : "gray"}
          onChange={handleBssidChange}
        />
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
