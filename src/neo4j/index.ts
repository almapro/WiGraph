import { Driver } from "neo4j-driver";
import { AppNode } from "../nodes/types";
import { Client, Wifi } from "../nodes";
import { Edge } from "@xyflow/react";
import { KismetWiFiDeviceList } from "../kismet";
import { v4 } from "uuid";

export const getNodes = async (
  driver: Driver,
  setNodes: (nodes: AppNode[]) => void,
  setEdges: (edges: Edge[]) => void,
  fitView: () => void,
) => {
  try {
    const session = driver.session();
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

    const clientsRecords: Client[] = clients.records.map((record) => ({
      ...record.toObject().c.properties,
      incoming_relations: Number(record.toObject().incomingRelations),
      outgoing_relations: Number(record.toObject().outgoingRelations),
      incoming_edges: record.toObject().incomingEdges,
      outgoing_edges: record.toObject().outgoingEdges,
    }));

    const clientsNodes = clientsRecords.map<AppNode>((client, i) => ({
      type: "client",
      id: client.id,
      position: {
        x: 50 * (i + 1),
        y: 100,
      },
      data: client,
    }));

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
    const records = result.records.map<Wifi>((record) => ({
      ...record.toObject().w.properties,
      incoming_relations: Number(record.toObject().incomingRelations),
      outgoing_relations: Number(record.toObject().outgoingRelations),
      incoming_edges: record.toObject().incomingEdges,
      outgoing_edges: record.toObject().outgoingEdges,
    }));

    const nodes = records.map<AppNode>((wifi, i) => {
      // Get all connected client nodes from incoming and outgoing edges
      const connectedClientIds = [
        ...wifi.incoming_edges
          .filter((edge) => clientsRecords.some((c) => c.id === edge.source))
          .map((e) => e.source),
        ...wifi.outgoing_edges
          .filter((edge) => clientsRecords.some((c) => c.id === edge.target))
          .map((e) => e.target),
      ];

      // Find matching client nodes and update their positions
      connectedClientIds.forEach((clientId) => {
        const clientNodeIndex = clientsNodes.findIndex(
          (n) => n.id === clientId,
        );
        if (clientNodeIndex !== -1) {
          // Add vertical spacing between client nodes
          const clientIndex = connectedClientIds.indexOf(clientId);
          // Add horizontal spacing between wifi nodes and their clients
          clientsNodes[clientNodeIndex].position.x =
            50 * (i + 1) + clientIndex * 50;
        }
      });
      return {
        type: "wifi",
        id: wifi.id,
        position: {
          x: 50 * (i + 1),
          y: 0,
        },
        data: {
          ...wifi,
          handshakes: [],
        },
      };
    });
    const edges: Edge[] = [];
    records.map((record) => {
      edges.push(
        ...record.incoming_edges.map((edge) => ({
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: "custom",
          data: {
            label: edge.type,
          },
        })),
      );
    });
    clientsRecords.map((record) => {
      edges.push(
        ...record.incoming_edges.map((edge) => ({
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: "custom",
          data: {
            label: edge.type,
          },
        })),
      );
    });
    setNodes([...nodes, ...clientsNodes]);
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
      await session
        .run(
          `
        MATCH (w:Wifi {id: $nodeId})
        WITH w, properties(w) as wProperties
        OPTIONAL MATCH (w)-[r]-()
        DELETE r, w
        RETURN wProperties
      `,
          { nodeId },
        )
        .then(async (result) => {
          deletedNodes = result.records.map((record) => ({
            ...record.toObject().wProperties,
            type: "wifi",
          }));
        });
      break;
    case "client":
      await session
        .run(
          `
        MATCH (c:Client {id: $nodeId})
        OPTIONAL MATCH (c)-[r]-()
        DELETE r
        WITH c, properties(c) as cProperties
        DELETE c
        RETURN cProperties
      `,
          { nodeId },
        )
        .then(async (result) => {
          deletedNodes = result.records.map((record) => ({
            ...record.toObject().cProperties,
            type: "client",
          }));
        });
      break;
  }
  await session.close();
  return deletedNodes;
};

export const importFromFile = async (
  driver: Driver,
  file: File,
  type: "kismet" | "airodump",
) => {
  const oui = await fetch("/oui.json");
  const ouiData: { [key: string]: string } = await oui.json();
  const fileContent = await file.text();
  const session = driver.session();
  const queries: { query: string; params: { [key: string]: any } }[] = [];
  switch (type) {
    case "kismet":
      try {
        const kismetData: KismetWiFiDeviceList = JSON.parse(fileContent);
        const aps = kismetData.filter(
          (device) => device["kismet.device.base.type"] === "Wi-Fi AP",
        );
        const apsWithClients = aps.filter(
          (ap) => ap["dot11.device"]["dot11.device.associated_client_map"],
        );
        const clients = kismetData.filter(
          (device) => device["kismet.device.base.type"] === "Wi-Fi Client",
        );
        aps.forEach((ap) => {
          const mac = ap["kismet.device.base.macaddr"]
            .slice(0, 8)
            .replaceAll(":", "");
          const apManufacturer = ouiData[mac] || "";
          let isHotspot =
            /(apple|google|samsung|xiaomi|oneplus|oppo|vivo|realme)/i.test(
              apManufacturer.toLowerCase(),
            );
          const isPrinter = /(hewlett packard|canon|epson|brother|xerox)/i.test(
            apManufacturer.toLowerCase(),
          );
          if (isPrinter) isHotspot = false;
          queries.push({
            query: `
            MATCH (existing:Wifi {bssid: $bssid}) 
            WITH count(existing) as nodeExists
            WHERE nodeExists = 0
            CREATE (w:Wifi {
              id: $id,
              essid: $essid,
              bssid: $bssid,
              probe: $probe,
              hotspot: $hotspot,
              printer: $printer,
              password: CASE WHEN $password = '' THEN null ELSE $password END,
              pin: CASE WHEN $pin = '' THEN null ELSE $pin END
            })
          `,
            params: {
              id: v4(),
              essid: ap["kismet.device.base.name"].trim(),
              bssid: ap["kismet.device.base.macaddr"].trim(),
              probe: false,
              hotspot: isHotspot,
              printer: isPrinter,
              password: "",
              pin: "",
            },
          });
        });
        clients.forEach((client) => {
          const mac = client["kismet.device.base.macaddr"]
            .slice(0, 8)
            .replaceAll(":", "");
          const clientManufacturer = ouiData[mac] || "";
          const isMobile =
            /(apple|google|samsung|xiaomi|oneplus|oppo|vivo|realme)/i.test(
              clientManufacturer.toLowerCase(),
            );
          queries.push({
            query: `
            MATCH (existing:Client {macAddress: $macAddress}) 
            WITH count(existing) as nodeExists
            WHERE nodeExists = 0
            CREATE (c:Client {
              id: $id,
              name: $name,
              macAddress: $macAddress,
              ipAddress: $ipAddress,
              desktop: $desktop,
              laptop: $laptop,
              tablet: $tablet,
              mobile: $mobile
            })
            `,
            params: {
              id: v4(),
              name: client["kismet.device.base.name"].trim() || "Unknown",
              macAddress: client["kismet.device.base.macaddr"].trim(),
              ipAddress: "",
              desktop: !isMobile,
              laptop: false,
              tablet: false,
              mobile: isMobile,
            },
          });
          const probedSsids =
            client["dot11.device"]["dot11.device.probed_ssid_map"];
          if (probedSsids) {
            probedSsids.forEach((ssid) => {
              if (ssid["dot11.probedssid.ssid"] !== "") {
                queries.push({
                  query: `
                MATCH (existing:Wifi {essid: $essid})
                WITH count(existing) as nodeExists
                WHERE nodeExists = 0
                CREATE (w:Wifi {
                  id: $id,
                  essid: $essid,
                  bssid: '',
                  probe: true,
                  hotspot: false,
                  printer: false,
                  password: null,
                  pin: null
                })
              `,
                  params: {
                    id: v4(),
                    essid: ssid["dot11.probedssid.ssid"],
                  },
                });
                queries.push({
                  query: `
                MATCH (w:Wifi {essid: $essid})
                MATCH (c:Client {macAddress: $macAddress})
                WITH c, w
                OPTIONAL MATCH (c)-[r]->(w)
                WITH c, w, r
                WHERE r IS NULL AND w.probe = true
                CREATE (c)-[:KNOWS]->(w)
                WITH c, w
                WHERE w.probe = false OR w.probe IS NULL
                CREATE (c)-[:CONNECTS_TO]->(w)
              `,
                  params: {
                    id: v4(),
                    essid: ssid["dot11.probedssid.ssid"],
                    macAddress: client["kismet.device.base.macaddr"].trim(),
                  },
                });
              }
            });
          }
        });
        apsWithClients.forEach((ap) => {
          queries.push({
            query: `
              MATCH (w:Wifi {bssid: $bssid})
              UNWIND $clientsMac as clientMac
              MATCH (c:Client {macAddress: clientMac})
              WITH c, w
              OPTIONAL MATCH (c)-[r:CONNECTS_TO]->(w)
              WITH c, w, r
              WHERE r IS NULL
              CREATE (c)-[:CONNECTS_TO]->(w)
              WITH c, w
              OPTIONAL MATCH (c)-[k:KNOWS]->(w)
              DELETE k
            `,
            params: {
              bssid: ap["kismet.device.base.macaddr"].trim(),
              clientsMac: Object.keys(
                ap["dot11.device"]["dot11.device.associated_client_map"] || {},
              ),
            },
          });
        });
        const transaction = session.beginTransaction();
        await Promise.all(
          queries.map((query) => transaction.run(query.query, query.params)),
        );
        await transaction.commit();
        await session.close();
      } catch (error) {
        console.error("Error parsing Kismet data:", error);
      }
      break;
    case "airodump":
      break;
  }
};
