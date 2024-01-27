interface AppContext {
  fleetData: FleetData;
  setStringData: (vin: vin, field: string, value: string) => void;
  setIntData: (vin: vin, field: string, value: number) => void;
  newVehicle: (vin: vin) => void;
  setKey: (vin: vin, key: string) => void;
  setCert: (vin: vin, cert: string) => void;
  changeVin: (oldVin: vin, newVin: vin) => void;
  configureServer: (host: string, port: string) => void;
  server: ServerData | null;
  isLoading: boolean;
}

export type InitialState = {
  fleetData: FleetData;
  serverData: ServerData;
  loading: boolean;
};

interface DataStore {
  loadData: () => Promise<{ fleetData: FleetData; serverData: ServerData }>;
  saveData: (fleetData: FleetData, serverData: ServerData) => Promise<void>;
}

export type vin = string;

export type KeyData = {
  [key: string]: {
    stringValue?: string;
    intValue?: number;
  };
};

export type Vehicle = {
  data: KeyData;
  key: string;
  cert: string;
};

export type FleetData = {
  [key: vin]: Vehicle;
};

export type ServerData = {
  host: string;
  port: string;
};
