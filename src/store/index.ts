import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { initialNodes } from "../nodes";
import { initialEdges } from "../edges";
import { type AppState } from "../nodes";
import { getLayoutedElements } from "../dagre";
import _ from "lodash";

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  setNodes: (nodes) => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, get().edges);
    set({ nodes: layoutedNodes, filteredNodes: layoutedNodes });
    get().filterNodes();
  },
  setEdges: (edges) => {
    const { edges: layoutedEdges } = getLayoutedElements(get().nodes, edges);
    set({ edges: layoutedEdges, filteredEdges: layoutedEdges });
    get().filterNodes();
  },
  filteredNodes: initialNodes,
  filteredEdges: initialEdges,
  search: "",
  setSearch: (search) => {
    set({ search });
  },
  showClients: true,
  showWifi: true,
  showConnectedNodesOnly: false,
  setShowClients: (showClients) => {
    set({ showClients });
  },
  setShowWifi: (showWifi) => {
    set({ showWifi });
  },
  setShowConnectedNodesOnly: (showConnectedNodesOnly) => {
    set({ showConnectedNodesOnly });
  },
  filterNodes: () => {
    const filtered = get().nodes.filter((node) => {
      let filtered = false;
      if (get().showClients && node.type === "client") {
        filtered = node.data.name
          .toLowerCase()
          .includes(get().search.toLowerCase());
      }
      if (get().showWifi && node.type === "wifi") {
        filtered = node.data.essid
          .toLowerCase()
          .includes(get().search.toLowerCase());
      }
      if (get().showConnectedNodesOnly && filtered) {
        filtered =
          ((node.type === "client" && get().showClients) ||
            (node.type === "wifi" && get().showWifi)) &&
          (node.data.incoming_relations > 0 ||
            node.data.outgoing_relations > 0);
      }
      return filtered;
    });
    const nodesConnectedToFilteredNodes = get().nodes.filter((node) => {
      return get().edges.find(
        (edge) =>
          (edge.source === node.id &&
            filtered.find((n) => n.id === edge.target)) ||
          (edge.target === node.id &&
            filtered.find((n) => n.id === edge.source)),
      );
    });
    const filteredNodes = _.uniqBy(
      [...nodesConnectedToFilteredNodes, ...filtered],
      "id",
    );
    const filteredEdges = get().edges.filter((edge) => {
      if (
        filteredNodes.find((node) => node.id === edge.source) &&
        filteredNodes.find((node) => node.id === edge.target)
      ) {
        return true;
      }
      return false;
    });
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      filteredNodes,
      filteredEdges,
    );
    set({
      filteredNodes: layoutedNodes,
      filteredEdges: layoutedEdges,
    });
  },
}));
