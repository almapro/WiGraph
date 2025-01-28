import type { Node, BuiltInNode } from "@xyflow/react";
import { Wifi } from "../nodes.types";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type WifiNode = Node<Wifi, "wifi">;
export type AppNode = BuiltInNode | PositionLoggerNode | WifiNode;
