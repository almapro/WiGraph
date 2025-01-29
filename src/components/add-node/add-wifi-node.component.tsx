import { Button, Label, TextInput, Tooltip } from "flowbite-react";
import { FC, Ref, useContext, useState } from "react";
import _ from "lodash";
import { DashboardContext } from "../../dashboard.context";
import { v4 } from "uuid";
import { FaEye, FaEyeSlash, FaWifi } from "react-icons/fa";
import { MdPermScanWifi, MdWifiTethering } from "react-icons/md";
import { useSnackbar } from "notistack";
import { AppContext } from "../../app.context";

export const AddWifiNodeComponent: FC<{ formRef: Ref<HTMLFormElement> }> = ({
  formRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { setShowAddNode } = useContext(AppContext);
  const { driver, updateGraph } = useContext(DashboardContext);
  const [id, setId] = useState(v4());
  const [essid, setEssid] = useState("");
  const [bssid, setBssid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState("");
  const [probe, setProbe] = useState(false);
  const [hotspot, setHotspot] = useState(false);
  const [bssidError, setBssidError] = useState(false);
  const handleBssidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBssidError(
      !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(e.target.value),
    );
    setBssid(e.target.value);
  };
  const handleOnSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    const session = driver.session();
    session
      .run(
        `CREATE (n:Wifi { id: $id, essid: $essid, bssid: $bssid, probe: $probe, hotspot: $hotspot${password !== "" ? ", password: $password" : ""}${pin !== "" ? ", pin: $pin" : ""} })`,
        _.assign(
          {},
          { id, essid, bssid, probe, hotspot },
          password !== "" ? { password } : {},
          pin !== "" ? { pin } : {},
        ),
      )
      .then(() => {
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
        updateGraph();
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
          <Label htmlFor="essid" value="ESSID *" />
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
          <Label htmlFor="bssid" value={`BSSID${probe ? "" : " *"}`} />
        </div>
        <TextInput
          required={!probe}
          id="bssid"
          placeholder="XX:XX:XX:XX:XX:XX"
          value={bssid}
          color={bssidError ? "failure" : "gray"}
          helperText={bssidError ? "BSSID must be formatted properly" : ""}
          onChange={handleBssidChange}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password" />
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
          <Label htmlFor="pin" value="PIN" />
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
          <Label value="Type" />
        </div>
        <div className="flex gap-2">
          <Tooltip content="WiFi" placement="bottom">
            <Button
              disabled={!probe && !hotspot}
              className="flex size-12"
              onClick={() => {
                setProbe(false);
                setHotspot(false);
              }}
            >
              <FaWifi className="m-auto" />
            </Button>
          </Tooltip>
          <Tooltip content="Probe" placement="bottom">
            <Button
              className="flex size-12"
              disabled={probe}
              onClick={() => {
                setProbe(true);
                setHotspot(false);
              }}
            >
              <MdPermScanWifi className="m-auto" />
            </Button>
          </Tooltip>
          <Tooltip content="Hotspot" placement="bottom">
            <Button
              className="flex size-12"
              disabled={hotspot}
              onClick={() => {
                setProbe(false);
                setHotspot(true);
              }}
            >
              <MdWifiTethering className="m-auto" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </form>
  );
};
