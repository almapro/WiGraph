export type NodeType =
  | "WIFI"
  | "WIFIPROBE"
  | "CLIENT"
  | "ROUTER"
  | "SERVER"
  | "NETWORK"
  | "SERVICE"
  | "RELATION"
  | "BUILDING"
  | "HOUSE"
  | "FLOOR";

export type RelationType =
  | "BROADCASTS"
  | "ATTACHED_TO"
  | "KNOWS_WIFI"
  | "OWNS"
  | "HAS_FLOOR"
  | "CONNECTS_TO";

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
  handshakes: Handshake[];
  incoming_realtions: boolean;
  outgoing_relations: boolean;
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

export type WifiClient = {
  id: string;
  mac: string;
};

export type RouterClient = WifiClient & {
  ip: string;
};
