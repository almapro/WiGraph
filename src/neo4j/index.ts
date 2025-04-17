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
        probe: false,
        hotspot: false,
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