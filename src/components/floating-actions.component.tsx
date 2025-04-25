import { Panel, useReactFlow } from "@xyflow/react";
import { FaFileUpload, FaMoon, FaSun } from "react-icons/fa";
import { FloatingButtonComponent } from "./floating-actions";
import { useContext } from "react";
import { AppContext, useDashboardContext } from "../context";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaRotateRight } from "react-icons/fa6";
import { getNodes } from "../neo4j";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

export const FloatingActionsComponent = () => {
  const { colorMode, setColorMode, setDriver } = useContext(AppContext);
  const { fitView } = useReactFlow();
  const { setNodes, setEdges } = useStore(
    useShallow((s) => ({
      setNodes: s.setNodes,
      setEdges: s.setEdges,
    })),
  );
  const { driver, setShowImportFromFile } = useDashboardContext();
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
        tooltip="Refresh"
        onClick={async (e) => {
          const button = e.currentTarget;
          button.classList.add("animate-spin");
          await getNodes(driver, setNodes, setEdges, fitView);
          setTimeout(() => {
            button.classList.remove("animate-spin");
          }, 1000);
        }}
      >
        <FaRotateRight className="m-auto" />
      </FloatingButtonComponent>
      <FloatingButtonComponent
        tooltip="Import from..."
        onClick={() => {
          setShowImportFromFile(true);
        }}
      >
        <FaFileUpload className="m-auto" />
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
