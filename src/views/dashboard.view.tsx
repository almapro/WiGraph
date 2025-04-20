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
import { Driver } from "neo4j-driver";
import { useCallback, useContext, useEffect } from "react";
import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { AddNodeComponent, ContextMenuComponent, DeleteNodeComponent, DeleteRelationComponent, FloatingActionsComponent, AddRelationComponent, AddClientsToWifiComponent, ConvertToWifiComponent, AddConnectionPanel } from "../components";
import { useTitle } from "react-use";
import { AppContext, useDashboardContext } from "../context";
import { getNodes } from "../neo4j";
import { DashboardProvider } from "../providers";

export const DashboardView: React.FC<{ driver: Driver }> = ({driver}) => {
  useTitle("WiGraph - Dashboard");
  const { colorMode } = useContext(AppContext);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setRelationToAdd, setShowAddRelation, setRelationToDelete, setShowDeleteRelation, setHoveringNode, setReconnecting, setContextMenu } = useDashboardContext();
  const onConnect: OnConnect = useCallback(
    (connection) => {
      setRelationToAdd(connection);
      setShowAddRelation(true);
    },
    [setRelationToAdd, setShowAddRelation],
  );
  const { fitView } = useReactFlow();
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
    <DashboardProvider driver={driver}>
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
      >
        <ContextMenuComponent />
        <DeleteNodeComponent />
        <DeleteRelationComponent />
        <AddNodeComponent />
        <AddRelationComponent />
        <AddClientsToWifiComponent />
        <ConvertToWifiComponent />
        <AddConnectionPanel />
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
        <FloatingActionsComponent />
      </ReactFlow>
    </DashboardProvider>
  );
};
