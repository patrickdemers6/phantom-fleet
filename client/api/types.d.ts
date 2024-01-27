export type VehicleData = {
  txid: string;
  key: string;
  cert: string;
  topic: string;
  vin: string;
  device_type: string;
  createdAt: number;
  messageId: string;
  data: Data[];
};

export type Data = {
  key: string;
  value: unknown;
};
