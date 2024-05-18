import { FleetData, Vehicle, Vin, setFleetDataFunction } from "./types";
import Methods from "@/api/methods";

const API = {
  loadData: async (setFleetData: setFleetDataFunction) => {
    await getFleetData(setFleetData);
    setInterval(() => {
      getFleetData(setFleetData);
    }, 3000);
  },

  saveData: async (_: FleetData) => {
    // data auto saved when user hits send
  },

  deleteByVin: async (vin: Vin) => {
    Methods.delete(`/vehicles/${vin}/fleet_telemetry_config`);
  }
};

const getFleetData = async (setFleetData: setFleetDataFunction) => {
  const result = await Methods.get("/data")
  const data = await result.json()

  const fleetData: {[key: string]: Vehicle} = {}
  Object.entries(data).forEach(([vin, values]) => {
    fleetData[vin] = { data: convert(values as any[]) };
  });
  setFleetData(fleetData);
}

const convert = (o: any[]): any => {
  const out: { [key: string ]: any } = {};
  o.forEach(({key, value}) => {
    if (key == 'Location') {
      out['LocationLatitude'] = { floatValueInternal: value.locationValue.latitude.toString() }
      out['LocationLongitude'] = { floatValueInternal: value.locationValue.longitude.toString() }
      return;
    }

    out[key] = convertFloat(value);
  });
  return out;
}

const convertFloat = (o: any): any => {
  if (typeof o !== 'object' || o === null) {
    return o;
  }

  if (Array.isArray(o)) {
    return o.map(item => convertFloat(item));
  }

  return Object.keys(o).reduce<{ [key: string ]: any }>((acc, key) => {
    const value = o[key];
    const newKey = key === 'floatValue' ? 'floatValueInternal' : key;
    const newValue = key === 'floatValue' ? value.toString() : value;
    acc[newKey] = convertFloat(newValue);
    return acc;
  }, {});
}

export default API;
