import type {
  Node,
  BuiltInNode,
  OnNodesChange,
  OnEdgesChange,
  Edge,
  OnConnect,
} from "@xyflow/react";
import { Wifi } from "../nodes.types";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type WifiNode = Node<Wifi, "wifi">;
export type AppNode = BuiltInNode | PositionLoggerNode | WifiNode;

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
};
