import type { Edge, EdgeTypes } from "@xyflow/react";
import { CustomEdge } from "./custom.edge";

export const initialEdges: Edge[] = [
  // { id: "a->c", source: "a", target: "c", animated: true },
  // { id: "b->d", source: "b", target: "d" },
  // { id: "c->d", source: "c", target: "d", animated: true },
  // { id: "a->e", source: "a", target: "e" },
];

export const edgeTypes = {
  custom: CustomEdge,
  // Add your custom edge types here!
} satisfies EdgeTypes;
