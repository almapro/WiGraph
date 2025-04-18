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
    const result = await session.run(`MATCH (w:Wifi) RETURN w`);
    const records: Wifi[] = result.records.map(
      (record) => record.toObject().w.properties
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
        handshakes: [],
        incoming_realtions: true,
        outgoing_relations: true,
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
