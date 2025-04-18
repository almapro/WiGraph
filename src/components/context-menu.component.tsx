import { useContext } from "react";
import { DashboardContext } from "../dashboard.context";
import { WifiContextMenu } from "./context-menu/wifi.context-menu";

export const ContextMenuComponent = () => {
  const { contextMenu } = useContext(DashboardContext);
  if (!contextMenu) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: contextMenu.y,
        left: contextMenu.x,
        zIndex: 1000,
      }}
    >
      {contextMenu.node.type === "wifi" && <WifiContextMenu node={contextMenu.node} />}
    </div>
  );
};
