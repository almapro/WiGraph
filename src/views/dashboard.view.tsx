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
} from "@xyflow/react";
import { Driver } from "neo4j-driver";
import { useCallback, useContext, useEffect, useState } from "react";
import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { AddNodeComponent, ContextMenuComponent, DeleteNodeComponent, FloatingActionsComponent } from "../components";
import { useTitle } from "react-use";
import { AppContext, DashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { AppNode } from "../nodes/types";

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
  const [isConvertingToWifi, setIsConvertingToWifi] = useState(false);
  const [isAddingClients, setIsAddingClients] = useState(false);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [isDeletingNode, setIsDeletingNode] = useState(false);
  const [activeNode, setActiveNode] = useState<AppNode | null>(null);
  const [showAddNode, setShowAddNode] = useState(false);
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
    >
      <DashboardContext.Provider
        value={{
          driver,
          contextMenu,
          isConvertingToWifi,
          setIsConvertingToWifi,
          isAddingClients,
          setIsAddingClients,
          isEditingNode,
          setIsEditingNode,
          isDeletingNode,
          setIsDeletingNode,
          activeNode,
          setActiveNode,
        showAddNode,
        setShowAddNode,
        }}
      >
        <ContextMenuComponent />
        <DeleteNodeComponent />
        <AddNodeComponent />
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
        <FloatingActionsComponent />
      </DashboardContext.Provider>
    </ReactFlow>
  );
};
