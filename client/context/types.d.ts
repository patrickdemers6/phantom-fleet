interface AppContext {
  fleetData: FleetData;
  setStringValue: (vin: Vin, field: string, value: string) => void;
  setIntValue: (vin: Vin, field: string, value: number | string) => void;
  setFloatValue: (vin: Vin, field: string, value: number | string) => void;
  setShiftState: (vin: string, field: string, value: ShiftState) => void;
  newVehicle: (vin: Vin) => void;
  changeVin: (oldVin: Vin, newVin: Vin) => void;
  deleteByVin: (vin: Vin) => void;
  isLoading: boolean;
}

export type InitialState = {
  fleetData: FleetData;
  loading: boolean;
};

type setFleetDataFunction = Dispatch<SetStateAction<FleetData>>

interface DataStore {
  loadData: (setFleetData: setFleetDataFunction) => Promise<void>;
  saveData: (fleetData: FleetData) => Promise<void>;
  deleteByVin: (vin: Vin) => Promise<void>
}

export type Vin = string;

export type LocationValue = {
  latitude?: number;
  longitude?: number;
};

export type LocationValueInternal = {
  latitude?: string;
  longitude?: string;
};

export type ShiftState = number;

export type ChargeState = number;

export type KeyData = {
  [key: string]: {
    stringValue?: string;
    intValue?: number;
    floatValueInternal?: string;
    floatValue?: number;
    shiftState?: ShiftState;
    chargeState?: ChargeState;
    locationValue?: LocationValue;
  };
};

export type Vehicle = {
  data: KeyData;
};

export type FleetData = {
  [key: Vin]: Vehicle;
};

export type Toast = {
  message: string;
  severity: string;
  duration: number;
};
