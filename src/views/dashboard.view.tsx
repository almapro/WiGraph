import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type OnConnect,
  BackgroundVariant,
  useReactFlow,
  Edge,
  MarkerType,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { initialNodes, nodeTypes, AppNode } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { ContextMenuComponent, DeleteNodeComponent, DeleteRelationComponent, FloatingActionsComponent, AddRelationComponent, AddClientsToWifiComponent, ConvertToWifiComponent, AddNodePanel, AddWifiNodeComponent, AddClientComponent } from "../components";
import { useTitle } from "react-use";
import { useAppContext, useDashboardContext } from "../context";
import { getNodes } from "../neo4j";

export const DashboardView = () => {
  useTitle("WiGraph - Dashboard");
  const { colorMode } = useAppContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setRelationToAdd, setShowAddRelation, setRelationToDelete, setShowDeleteRelation, setHoveringNode, setReconnecting, setContextMenu, driver, setShowAddNode, setDragIntersectingNodes, setDragging } = useDashboardContext();
  const onConnect: OnConnect = useCallback(
    (connection) => {
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (source?.type === "client" && target?.type === "wifi") {
        setRelationToAdd(connection);
        setShowAddRelation(true);
      }
    },
    [],
  );
  const { fitView, screenToFlowPosition, getIntersectingNodes } = useReactFlow();
  useEffect(() => {
    getNodes(driver, setNodes, setEdges, fitView);
  }, [setNodes, driver, fitView]);

  const defaultEdgeOptions = {
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#b1b1b7',
    },
  };
  const onReconnectEnd = useCallback((__: any, edge: Edge) => {
    setShowDeleteRelation(true);
    setRelationToDelete(edge);
    setReconnecting(false);
  }, []);
  
  return (
    <ReactFlow
      colorMode={colorMode}
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      onNodeContextMenu={(event, node) => {
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY,
          node: node,
        });
      }}
      onClick={() => {
        setContextMenu(null);
      }}
      defaultEdgeOptions={defaultEdgeOptions}
      onNodeMouseEnter={(__, node) => {
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
        const intersectingNodes = getIntersectingNodes({ ...position, width: 5, height: 5 });
        setDragIntersectingNodes(intersectingNodes as AppNode[]);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setShowAddNode(true);
      }}
    >
      <ContextMenuComponent />
      <DeleteNodeComponent />
      <DeleteRelationComponent />
      <AddWifiNodeComponent />
      <AddClientComponent />
      <AddRelationComponent />
      <AddClientsToWifiComponent />
      <ConvertToWifiComponent />
      <AddNodePanel />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <FloatingActionsComponent />
    </ReactFlow>
  );
};
