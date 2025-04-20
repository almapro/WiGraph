import type {
  Node,
  BuiltInNode
} from "@xyflow/react";


export type NewNodeGroupNode = Node<{}, "newNodeGroup">;
export type NewWifiNode = Node<{}, "newWifiNode">;
export type NewClientNode = Node<{}, "newClientNode">;
export type WifiNode = Node<Wifi, "wifi">;
export type ClientNode = Node<Client, "client">;
export type AppNode = BuiltInNode | NewNodeGroupNode | NewWifiNode | NewClientNode | WifiNode | ClientNode;

export type NodeType =
  | "WIFI"
  | "CLIENT"
  | "ROUTER"
  | "SERVER"
  | "NETWORK"
  | "SERVICE"
  | "BUILDING"
  | "HOUSE"
  | "FLOOR";

export type RelationType =
  | "BROADCASTS"
  | "ATTACHED_TO"
  | "KNOWS"
  | "OWNS"
  | "HAS_FLOOR"
  | "CONNECTS_TO"
  | "PROVIDED_BY";

export type Building = {
  type: "BULDING" | "HOUSE";
  name: string;
  id: string;
};

export type Floor = {
  id: string;
  number: string;
};

export type Wifi = {
  id: string;
  essid: string;
  bssid: string;
  password: string;
  pin: string;
  hotspot: boolean;
  probe: boolean;
  printer: boolean;
  handshakes: Handshake[];
  incoming_relations: number;
  outgoing_relations: number;
  outgoing_edges: RelationEdge[];
  incoming_edges: RelationEdge[];
};

export type RelationEdge = {
  source: string;
  target: string;
  type: RelationType;
};

export type Router = {
  id: string;
  ip: string;
  mac: string;
};

export type Handshake = {
  id: string;
  filePath: string;
  filename: string;
};

export type Client = {
  id: string;
  mobile: boolean;
  laptop: boolean;
  tablet: boolean;
  desktop: boolean;
  name: string;
  macAddress: string;
  incoming_relations: number;
  outgoing_relations: number;
  outgoing_edges: RelationEdge[];
  incoming_edges: RelationEdge[];
  ip?: string;
};
