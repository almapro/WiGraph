import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  BackgroundVariant,
  useReactFlow,
  Edge,
  MarkerType,
} from "@xyflow/react";
import { Driver } from "neo4j-driver";
import { useCallback, useContext, useEffect, useState } from "react";
import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { AddNodeComponent, ContextMenuComponent, DeleteNodeComponent, DeleteRelationComponent, FloatingActionsComponent } from "../components";
import { useTitle } from "react-use";
import { AppContext, DashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { AppNode } from "../nodes";

export const DashboardView: React.FC<{ driver: Driver }> = ({driver}) => {
  useTitle("WiGraph - Dashboard");
  const { colorMode } = useContext(AppContext);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );
  const { fitView } = useReactFlow();
  useEffect(() => {
    getNodes(driver, setNodes, setEdges, fitView);
  }, [setNodes, driver, fitView]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: AppNode;
  } | null>(null);
  const [showConvertingToWifi, setShowConvertingToWifi] = useState(false);
  const [showAddingClients, setShowAddingClients] = useState(false);
  const [showEditingNode, setShowEditingNode] = useState(false);
  const [showDeleteNode, setShowDeleteNode] = useState(false);
  const [activeNode, setActiveNode] = useState<AppNode | null>(null);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showDeleteRelation, setShowDeleteRelation] = useState(false);
  const [relationToDelete, setRelationToDelete] = useState<Edge | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const defaultEdgeOptions = {
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#b1b1b7',
    },
  };
  
  return (
    <DashboardContext.Provider
      value={{
        driver,
        contextMenu,
        showConvertingToWifi,
        setShowConvertingToWifi,
        showAddingClients,
        setShowAddingClients,
        showEditingNode,
        setShowEditingNode,
        showDeleteNode,
        setShowDeleteNode,
        activeNode,
        setActiveNode,
        showAddNode,
        setShowAddNode,
        showDeleteRelation,
        setShowDeleteRelation,
        relationToDelete,
        setRelationToDelete,
        selectedEdge,
        setSelectedEdge,
      }}
    >
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
        onSelectionChange={(selection) => {
          if (selection.edges.length > 0) {
            setSelectedEdge(selection.edges[0]);
          } else {
            setSelectedEdge(null);
          }
        }}
      >
        <ContextMenuComponent />
        <DeleteNodeComponent />
        <DeleteRelationComponent />
        <AddNodeComponent />
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
        <FloatingActionsComponent />
      </ReactFlow>
    </DashboardContext.Provider>
  );
};
