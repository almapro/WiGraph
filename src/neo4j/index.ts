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
    console.log(result.records[0]);
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
  console.log(node);
  const session = driver.session();
  const nodeId = node.id;
  switch (node.type) {
    case "wifi":
      await session.run(`
        MATCH (w:Wifi {id: $nodeId})
        OPTIONAL MATCH (c:Client)-[r:CONNECTS_TO]->(w)
        DELETE r, w
      `, { nodeId });
      break;
    case "client":
      await session.run(`
        MATCH (c:Client {id: $nodeId})
        DELETE c
      `, { nodeId });
      break;
  }
  await session.close();
};
