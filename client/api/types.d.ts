export type VehicleData = {
  txid: string;
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
