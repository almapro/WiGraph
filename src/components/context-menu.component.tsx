import { useDashboardContext } from "../context";
import { WifiContextMenu } from "./context-menu/wifi.context-menu";
import { ClientContextMenu } from "./context-menu/client.context-menu";

export const ContextMenuComponent = () => {
  const { contextMenu } = useDashboardContext();
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
      {contextMenu.node.type === "client" && <ClientContextMenu node={contextMenu.node} />}
    </div>
  );
};
