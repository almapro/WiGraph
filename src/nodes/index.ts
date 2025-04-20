import type { NodeTypes } from "@xyflow/react";

import { AppNode } from "./types";
import { WifiNode } from "./wifi.node";
import { ClientNode } from "./client.node";
import { NewNodeGroupNode } from "./new-node-group.node";
import { NewWifiNode } from "./new-wifi.node";
import { NewClientNode } from "./new-client.node";

export const initialNodes: AppNode[] = [
  // { id: "a", type: "input", position: { x: 0, y: 0 }, data: { label: "wire" } },
  // {
  //   id: "b",
  //   type: "position-logger",
  //   position: { x: -100, y: 100 },
  //   data: { label: "drag me!" },
  // },
  // { id: "c", position: { x: 100, y: 100 }, data: { label: "your ideas" } },
  // {
  //   id: "d",
  //   type: "output",
  //   position: { x: 0, y: 200 },
  //   data: { label: "with React Flow" },
  // },
  // {
  //   id: "e",
  //   type: "wifi",
  //   position: { x: -175, y: 50 },
  //   data: {
  //     id: "",
  //     essid: "Wifi Node",
  //     bssid: "",
  //     handshakes: [],
  //     password: "",
  //     pin: "",
  //     hotspot: false,
  //     probe: true,
  //     incoming_realtions: 0,
  //     outgoing_relations: 0,
  //   },
  // },
];

export const nodeTypes = {
  wifi: WifiNode,
  client: ClientNode,
  newNodeGroup: NewNodeGroupNode,
  newWifiNode: NewWifiNode,
  newClientNode: NewClientNode,
} satisfies NodeTypes;

export * from "./types";