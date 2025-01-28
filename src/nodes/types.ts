import type { Node, BuiltInNode } from "@xyflow/react";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type WifiNode = Node<
  {
    ESSID: string;
    BSSID: string;
    password: string;
    pin: string;
    handshakes: string[];
    label: string;
  },
  "wifi"
>;
export type AppNode = BuiltInNode | PositionLoggerNode | WifiNode;
