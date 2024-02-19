interface AppContext {
  fleetData: FleetData;
  setStringValue: (vin: Vin, field: string, value: string) => void;
  setIntValue: (vin: Vin, field: string, value: number | string) => void;
  setLocationValue: (vin: string, field: string, value: LocationValue) => void;
  setChargeState: (vin: string, field: string, value: ChargeState) => void;
  setShiftState: (vin: string, field: string, value: ShiftState) => void;
  newVehicle: (vin: Vin, cert: string, key: string) => void;
  setKey: (vin: Vin, key: string) => void;
  setCert: (vin: Vin, cert: string) => void;
  changeVin: (oldVin: Vin, newVin: Vin) => void;
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

export type Vin = string;

export type LocationValue = {
  latitude: number;
  longitude: number;
};

export type ShiftState = number;

export type ChargeState = number;

export type KeyData = {
  [key: string]: {
    stringValue?: string;
    intValue?: number;
    shiftState?: ShiftState;
    chargeState?: ChargeState;
    locationValue?: LocationValue;
  };
};

export type Vehicle = {
  data: KeyData;
  key: string;
  cert: string;
};

export type FleetData = {
  [key: Vin]: Vehicle;
};

export type ServerData = {
  host: string;
  port: string;
};
