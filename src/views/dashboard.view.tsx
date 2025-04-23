import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  Edge,
  MarkerType,
  Connection,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { nodeTypes, AppNode } from "../nodes";
import { edgeTypes } from "../edges";
import {
  ContextMenuComponent,
  DeleteNodeComponent,
  DeleteRelationComponent,
  FloatingActionsComponent,
  AddRelationComponent,
  AddClientsToWifiComponent,
  ConvertToWifiComponent,
  AddNodePanel,
  AddWifiNodeComponent,
  AddClientComponent,
  EditWifiNodeComponent,
  EditClientNodeComponent,
  ImportFromComponent,
  FiltersPanel,
} from "../components";
import { useTitle } from "react-use";
import { useAppContext, useDashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store";

export const DashboardView = () => {
  useTitle("WiGraph - Dashboard");
  const { colorMode } = useAppContext();
  const {
    filteredNodes,
    filteredEdges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  } = useStore(
    useShallow((s) => ({
      filteredNodes: s.filteredNodes as AppNode[],
      filteredEdges: s.filteredEdges as Edge[],
      setNodes: s.setNodes,
      setEdges: s.setEdges,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
    })),
  );
  const {
    setRelationToDelete,
    setShowDeleteRelation,
    setHoveringNode,
    setReconnecting,
    setContextMenu,
    driver,
    setShowAddNode,
    setDragIntersectingNodes,
    setDragging,
    selectedNode,
    setSelectedNode,
    setRelationToAdd,
    setShowAddRelation,
  } = useDashboardContext();
  const { fitView, screenToFlowPosition, getIntersectingNodes } =
    useReactFlow();
  useEffect(() => {
    getNodes(driver, setNodes, setEdges, fitView);
  }, [setNodes, driver, fitView]);
  const onConnect = useCallback(
    (connection: Connection) => {
      const source = filteredNodes.find(
        (node) => node.id === connection.source,
      );
      const target = filteredNodes.find(
        (node) => node.id === connection.target,
      );
      if (
        (source?.type === "client" && target?.type === "wifi") ||
        (source?.type === "wifi" && target?.type === "client")
      ) {
        setRelationToAdd(connection);
        setShowAddRelation(true);
      }
    },
    [filteredNodes],
  );

  const defaultEdgeOptions = {
    type: "floating",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#b1b1b7",
    },
  };
  const onReconnectEnd = useCallback((__: any, edge: Edge) => {
    setShowDeleteRelation(true);
    setRelationToDelete(edge);
    setReconnecting(false);
  }, []);
  const onNodeDoubleClick = useCallback(
    (e: any, node: AppNode) => {
      e.preventDefault();
      setSelectedNode(selectedNode?.id === node.id ? null : node);
    },
    [selectedNode],
  );

  return (
    <ReactFlow
      colorMode={colorMode}
      nodes={filteredNodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange || undefined}
      edges={filteredEdges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange || undefined}
      onConnect={onConnect}
      fitView
      onNodeContextMenu={(event, node: AppNode) => {
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY,
          node: node,
        });
      }}
      onClick={() => {
        setContextMenu(null);
        setSelectedNode(null);
      }}
      defaultEdgeOptions={defaultEdgeOptions}
      onNodeMouseEnter={(__, node: AppNode) => {
        setHoveringNode(node);
      }}
      onNodeMouseLeave={() => {
        setHoveringNode(null);
      }}
      onReconnectStart={() => {
        setReconnecting(true);
      }}
      onReconnectEnd={onReconnectEnd}
      onReconnect={() => {}}
      onDragStart={() => {
        setDragging(true);
      }}
      onDragEnd={() => {
        setDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        const intersectingNodes = getIntersectingNodes({
          ...position,
          width: 5,
          height: 5,
        });
        setDragIntersectingNodes(intersectingNodes as AppNode[]);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setShowAddNode(true);
      }}
      onNodeDoubleClick={onNodeDoubleClick}
    >
      <ContextMenuComponent />
      <DeleteNodeComponent />
      <DeleteRelationComponent />
      <EditWifiNodeComponent />
      <EditClientNodeComponent />
      <AddWifiNodeComponent />
      <AddClientComponent />
      <AddRelationComponent />
      <AddClientsToWifiComponent />
      <ConvertToWifiComponent />
      <AddNodePanel />
      <ImportFromComponent />
      <FiltersPanel />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <FloatingActionsComponent />
    </ReactFlow>
  );
};
