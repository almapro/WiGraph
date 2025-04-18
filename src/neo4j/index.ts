import { Driver } from "neo4j-driver";
import { AppNode } from "../nodes/types";
import { Client, Wifi } from "../nodes";
import { Edge } from "@xyflow/react";
export const getNodes = async (
  driver: Driver,
  setNodes: (nodes: AppNode[]) => void,
  setEdges: (edges: Edge[]) => void,
  fitView: () => void
) => {
  try {
    const session = driver.session();
    const result = await session.run(`
      MATCH (w:Wifi)
      OPTIONAL MATCH (w)-[r1]->(n1)
      OPTIONAL MATCH (n2)-[r2]->(w)
      RETURN w, 
        COUNT(r1) as outgoingRelations, 
        COUNT(r2) as incomingRelations,
        COLLECT(DISTINCT {
          source: n2.id,
          target: w.id,
          type: TYPE(r2)
        }) as incomingEdges,
        COLLECT(DISTINCT {
          source: w.id,
          target: n1.id,
          type: TYPE(r1)
        }) as outgoingEdges
    `);
    const records: Wifi[] = result.records.map(
      (record) => ({ ...record.toObject().w.properties, incoming_relations: record.toObject().incomingRelations, outgoing_relations: record.toObject().outgoingRelations, incoming_edges: record.toObject().incomingEdges, outgoing_edges: record.toObject().outgoingEdges })
    );

    const nodes = records.map<AppNode>((wifi, i) => ({
      type: "wifi",
      id: wifi.id,
      position: {
        x: 50 * (i + 1),
        y: 0,
      },
      data: {
        ...wifi,
        handshakes: []
      },
    }));

    const clients = await session.run(`
      MATCH (c:Client)
      OPTIONAL MATCH (c)-[r1]->(n1)
      OPTIONAL MATCH (n2)-[r2]->(c)
      RETURN c, 
        COUNT(r1) as outgoingRelations, 
        COUNT(r2) as incomingRelations,
        COLLECT(DISTINCT {
          source: n2.id,
          target: c.id,
          type: TYPE(r2)
        }) as incomingEdges,
        COLLECT(DISTINCT {
          source: c.id,
          target: n1.id,
          type: TYPE(r1)
        }) as outgoingEdges
    `);

    const clientsRecords: Client[] = clients.records.map(
      (record) => ({ ...record.toObject().c.properties, incoming_relations: record.toObject().incomingRelations, outgoing_relations: record.toObject().outgoingRelations, incoming_edges: record.toObject().incomingEdges, outgoing_edges: record.toObject().outgoingEdges })
    );

    const clientsNodes = clientsRecords.map<AppNode>((client, i) => ({
      type: "client",
      id: client.id,
      position: {
        x: 50 * (i + 1),
        y: 50,
      },
      data: client
    }));

    setNodes([...nodes, ...clientsNodes]);
    const edges: Edge[] = [];
        records.map((record) => {
            edges.push(...record.incoming_edges.map((edge) => ({
                id: `${edge.source}-${edge.target}`,
                source: edge.source,
                target: edge.target,
                type: edge.type
          })))
        });
    clientsRecords.map((record) => {
        edges.push(...record.incoming_edges.map((edge) => ({
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: edge.type
        })))
    })
    setEdges(edges);
    fitView();
    await session.close();
  } catch (error) {
    console.error("Error fetching nodes:", error);
    throw error;
  }
};

export const deleteNode = async (driver: Driver, node: AppNode) => {
  const session = driver.session();
  const nodeId = node.id;
  let deletedNodes: AppNode[] = [];
  switch (node.type) {
    case "wifi":
      await session.run(`
        MATCH (w:Wifi {id: $nodeId})
        WITH w, properties(w) as wProperties
        OPTIONAL MATCH (w)-[r]-()
        DELETE r, w
        RETURN wProperties
      `, { nodeId }).then(async (result) => {
        deletedNodes = result.records.map((record) => ({ ...record.toObject().wProperties, type: "wifi" }));
      });
      break;
    case "client":
      await session.run(`
        MATCH (c:Client {id: $nodeId})
        OPTIONAL MATCH (c)-[r]-()
        DELETE r
        WITH c, properties(c) as cProperties
        DELETE c
        RETURN cProperties
      `, { nodeId }).then(async (result) => {
        deletedNodes = result.records.map((record) => ({ ...record.toObject().cProperties, type: "client" }));
      });
      break;
  }
  await session.close();
  return deletedNodes;
};
