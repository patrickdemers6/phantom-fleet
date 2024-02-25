import { KeyData, Vehicle } from "@/context/types";
import Methods from "./methods";
import { Data, VehicleData } from "./types.d";
import isNumber from '@/helpers/isNumber';

let msgCount = 0;

const fixFloatValues = (data: KeyData): KeyData => {
  return Object.entries(data).reduce((obj, [key, value]) => {
    if (value.floatValueInternal) {
      value.floatValue = 0;
    if (isNumber(value.floatValueInternal)) {
      value.floatValue = parseFloat(value.floatValueInternal);
    }
      delete value.floatValueInternal;
    }
    obj[key] = value;
    return obj;
  }, {} as KeyData);
}

const fixLocationValues = (data: KeyData): KeyData => {
  // until this point, location values have been stored as float
  // with -Latitude or -Longitude suffix
  const locationFields = Object.keys(data).filter(k => k.endsWith('Latitude')).map(k => k.slice(0, k.length - 'Latitude'.length));

  const locations = locationFields.reduce((obj, key) => {
    obj[key] = {
      locationValue: {
        latitude: data[key + 'Latitude'].floatValue,
        longitude: data[key + 'Longitude'].floatValue
      }
    }
    return obj;
  }, {} as KeyData);

  return Object.entries(data).reduce((obj, [key, value]) => {
    const isLatitude = key.endsWith('Latitude');
    const isLongitude = key.endsWith('Longitude');

    if (isLatitude || isLongitude) return obj;

    obj[key] = value;
    return obj;
  }, locations);
}

const createData = (data: KeyData) => {
  let modifiedData = fixFloatValues(data);
  modifiedData = fixLocationValues(modifiedData);
  return Object.entries(modifiedData).reduce((arr, [key, value]) => {
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
