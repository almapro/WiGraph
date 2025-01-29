import { Panel, useReactFlow } from "@xyflow/react";
import {
  FaDownload,
  FaFileUpload,
  FaMoon,
  FaPlus,
  FaSun,
} from "react-icons/fa";
import { FloatingButtonComponent } from "./floating-actions";
import { useContext } from "react";
import { AppContext } from "../app.context";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaRotateLeft } from "react-icons/fa6";
import { getNodes } from "../neo4j";
import { useStore } from "../store";
import { useShallow } from "zustand/shallow";

export const FloatingActionsComponent = () => {
  const { colorMode, setColorMode, setDriver, driver, setShowAddNode } =
    useContext(AppContext);
  const { fitView } = useReactFlow();
  const setNodes = useStore(useShallow((state) => state.setNodes));
  return (
    <Panel position="top-right" className="flex flex-col gap-2">
      <FloatingButtonComponent
        tooltip="Toggle color mode"
        onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
      >
        {colorMode === "dark" ? (
          <FaSun className="m-auto" />
        ) : (
          <FaMoon className="m-auto" />
        )}
      </FloatingButtonComponent>
      <FloatingButtonComponent
        tooltip="Add Node"
        onClick={() => setShowAddNode(true)}
      >
        <FaPlus className="m-auto" />
      </FloatingButtonComponent>
      <FloatingButtonComponent
        tooltip="Refresh"
        onClick={() => {
          if (driver) getNodes(driver, setNodes, fitView);
        }}
      >
        <FaRotateLeft className="m-auto" />
      </FloatingButtonComponent>
      <FloatingButtonComponent
        tooltip="Import from..."
        onClick={() => {
          driver?.close();
          setDriver(null);
        }}
      >
        <FaFileUpload className="m-auto" />
      </FloatingButtonComponent>
      <FloatingButtonComponent
        tooltip="Export"
        onClick={() => {
          driver?.close();
          setDriver(null);
        }}
      >
        <FaDownload className="m-auto" />
      </FloatingButtonComponent>
      <FloatingButtonComponent
        tooltip="Disconnect"
        onClick={() => {
          driver?.close();
          setDriver(null);
        }}
      >
        <VscDebugDisconnect className="m-auto" />
      </FloatingButtonComponent>
    </Panel>
  );
};
