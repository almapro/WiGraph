import { Edge } from "@xyflow/react";
import { AppNode } from "../nodes";
import * as dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (nodes: AppNode[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: "BT" });
  nodes.forEach((node) => {
    dagreGraph.removeNode(node.id);
    dagreGraph.setNode(node.id, { width: 32, height: 32 });
  });
  edges.forEach((edge) => {
    dagreGraph.removeEdge(edge.source, edge.target);
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 16,
      y: nodeWithPosition.y - 16,
    };

    return node;
  });

  return { nodes, edges };
};
