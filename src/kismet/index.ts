export interface KismetProbedSSID {
  "dot11.probedssid.bssid": string;
  "dot11.probedssid.crypt_set": number;
  "dot11.probedssid.first_time": number;
  "dot11.probedssid.last_time": number;
  "dot11.probedssid.ssid": string;
  "dot11.probedssid.ssidlen": number;
  "dot11.probedssid.wpa_mfp_required"?: number;
  "dot11.probedssid.wpa_mfp_supported"?: number;
}

export interface KismetDot11Device {
  "dot11.device.beacon_fingerprint": number;
  "dot11.device.bss_timestamp": number;
  "dot11.device.client_disconnects": number;
  "dot11.device.client_disconnects_last": number;
  "dot11.device.datasize": number;
  "dot11.device.datasize_retry": number;
  "dot11.device.last_beacon_timestamp": number;
  "dot11.device.last_bssid": string;
  "dot11.device.last_sequence": number;
  "dot11.device.link_measurement_capable": number;
  "dot11.device.max_tx_power": number;
  "dot11.device.min_tx_power": number;
  "dot11.device.neighbor_report_capable": number;
  "dot11.device.num_advertised_ssids": number;
  "dot11.device.num_associated_clients": number;
  "dot11.device.num_client_aps": number;
  "dot11.device.num_fragments": number;
  "dot11.device.num_probed_ssids": number;
  "dot11.device.num_responded_ssids": number;
  "dot11.device.num_retries": number;
  "dot11.device.probe_fingerprint": number;
  "dot11.device.response_fingerprint": number;
  "dot11.device.typeset": number;
  "dot11.device.wps_m3_count": number;
  "dot11.device.wps_m3_last": number;
  "dot11.device.last_probed_ssid_record"?: KismetProbedSSID;
  "dot11.device.probed_ssid_map"?: KismetProbedSSID[];
  "dot11.device.associated_client_map"?: { [key: string]: string };
}

export interface KismetWiFiDevice {
  "dot11.device": KismetDot11Device;
  "kismet.device.base.type": "Wi-Fi Client" | "Wi-Fi AP";
  "kismet.device.base.macaddr": string;
  "kismet.device.base.channel": string;
  "kismet.device.base.frequency": number;
  "kismet.device.base.commonname": string;
  "kismet.device.base.first_time": number;
  "kismet.device.base.last_time": number;
  "kismet.device.base.packets.total": number;
  "kismet.device.base.packets.tx_total": number;
  "kismet.device.base.packets.rx_total": number;
  "kismet.server.uuid": string;
  [key: string]: any;
}

export type KismetWiFiDeviceList = KismetWiFiDevice[];
