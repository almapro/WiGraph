export type AirodumpWirelessNetwork = {
  BSSID: string;
  SSID?: {
    essid: string;
  };
  "wireless-client"?: AirodumpWirelessClient[] | AirodumpWirelessClient;
};

export type AirodumpWirelessClient = {
  "client-mac": string;
  SSID?:
    | {
        ssid?: string;
      }[]
    | {
        ssid?: string;
      };
};

export type AirodumpData = {
  "?xml": string;
  "detection-run": {
    "wireless-network": AirodumpWirelessNetwork[] | AirodumpWirelessNetwork;
  };
};

export const htmlEntityHexToString = (html: string) => {
  const matches = html.match(/&#x([0-9a-fA-F]+);/g);
  if (!matches) return html;

  const bytes: number[] = matches.map((entity) =>
    parseInt(entity.replace(/[&#x;]/g, ""), 16),
  );

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(new Uint8Array(bytes));
};
