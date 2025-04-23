import type {
  Node,
  BuiltInNode,
  Edge,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";

export type NewNodeGroupNode = Node<{}, "newNodeGroup">;
export type NewWifiNode = Node<{}, "newWifiNode">;
export type NewClientNode = Node<{}, "newClientNode">;
export type WifiNode = Node<Wifi, "wifi">;
export type ClientNode = Node<Client, "client">;
export type AppNode =
  | BuiltInNode
  | NewNodeGroupNode
  | NewWifiNode
  | NewClientNode
  | WifiNode
  | ClientNode;
export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  filteredNodes: AppNode[];
  filteredEdges: Edge[];
  search: string;
  setSearch: (search: string) => void;
  showClients: boolean;
  showWifi: boolean;
  showConnectedNodesOnly: boolean;
  setShowClients: (showClients: boolean) => void;
  setShowWifi: (showWifi: boolean) => void;
  setShowConnectedNodesOnly: (showConnectedNodesOnly: boolean) => void;
  filterNodes: () => void;
};

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
