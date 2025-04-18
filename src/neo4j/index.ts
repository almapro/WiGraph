import { Driver } from "neo4j-driver";
import { AppNode } from "../nodes/types";
import { Wifi } from "../nodes.types";

export const getNodes = async (
  driver: Driver,
  setNodes: (nodes: AppNode[]) => void,
  fitView: () => void
) => {
  try {
    const session = driver.session();
    const result = await session.run(`
      MATCH (w:Wifi)
      OPTIONAL MATCH (w)-[r1]->(n1)
      OPTIONAL MATCH (n2)-[r2]->(w)
      RETURN w, COUNT(r1) > 0 as hasOutgoingRelations, COUNT(r2) > 0 as hasIncomingRelations
    `);
    const records: Wifi[] = result.records.map(
      (record) => ({ ...record.toObject().w.properties, incoming_realtions: record.toObject().hasIncomingRelations, outgoing_relations: record.toObject().hasOutgoingRelations })
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

    setNodes(nodes);
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
        OPTIONAL MATCH (c:Client)-[r:CONNECTS_TO]->(w)
        DELETE r, w
        RETURN wProperties
      `, { nodeId }).then(async (result) => {
        deletedNodes = result.records.map((record) => ({ ...record.toObject().wProperties, type: "wifi" }));
      });
      break;
    case "client":
      await session.run(`
        MATCH (c:Client {id: $nodeId})
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
