import { KeyData, Vehicle } from "@/context/types";
import Methods from "./methods";
import { Data, VehicleData } from "./types.d";

let msgCount = 0;

const createData = (data: KeyData) => {
  return Object.entries(data).reduce((arr, [key, value]) => {
    arr.push({ key, value });
    return arr;
  }, [] as Data[]);
};

const sendData = async (vin: string, data: Vehicle) => {
  const id = `msg-${msgCount++}`;
  const payload: VehicleData = {
    cert: data.cert,
    key: data.key,
    data: createData(data.data),
    messageId: id,
    createdAt: Date.now(),
    txid: id,
    topic: "V",
    vin,
    device_type: "vehicle_device",
  };

  const res = await Methods.post("/data", {
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to send data");
  }
};

export default sendData;
