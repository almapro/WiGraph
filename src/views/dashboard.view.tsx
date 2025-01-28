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
} from "@xyflow/react";
import { Driver } from "neo4j-driver";
import { useCallback, useContext, useEffect } from "react";
import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { FloatingActionsComponent } from "../components";
import { useTitle } from "react-use";
import { AppContext } from "../app.context";
import { Wifi } from "../nodes.types";
import { AppNode } from "../nodes/types";

export const DashboardView: React.FC<{ driver: Driver }> = ({ driver }) => {
  useTitle("WiGraph - Dashboard");
  const { colorMode } = useContext(AppContext);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );
  useEffect(() => {
    driver
      .session()
      .run(`MATCH (w:Wifi) RETURN w`)
      .then((result) => {
        const records: Wifi[] = result.records.map(
          (record) => record.toObject().w.properties,
        );
        console.log({ records });
        setNodes(
          records.map<AppNode>((wifi, i) => ({
            type: "wifi",
            id: wifi.id,
            position: {
              x: 50 * (i + 1),
              y: 0,
            },
            data: {
              ...wifi,
              probe: false,
              hotspot: false,
              handshakes: [],
              incoming_realtions: true,
              outgoing_relations: true,
            },
          })),
        );
      });
  }, [setNodes, driver]);
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
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <FloatingActionsComponent />
    </ReactFlow>
  );
};
