'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AppContext, ChargeState, DataStore, FleetData, KeyData, ServerData, ShiftState
} from './types';

type ContextProviderProps = {
  children: React.ReactNode;
  Context: React.Context<AppContext | undefined>;
  dataStore: DataStore;
};

const ContextProvider = ({
  Context,
  children,
  dataStore,
}: ContextProviderProps) => {
  const [fleetData, setFleetData] = useState<FleetData>({});
  const [serverData, setServerData] = useState<ServerData>({
    host: '',
    port: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // useEffect never uses ssr. localStorage only available on client
  useEffect(() => {
    (async () => {
      const data = await dataStore.loadData();
      setFleetData(data.fleetData);
      setServerData(data.serverData);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // first time isLoading turns false don't save
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    (async () => {
      await dataStore.saveData(fleetData, serverData);
    })();
  }, [fleetData, serverData]);

  const setData = (vin: string, updated: KeyData) => {
    setFleetData((d) => ({
      ...d,
      [vin]: {
        ...d[vin],
        data: { ...(d[vin].data || {}), ...updated },
      },
    }));
  };

  const setStringValue = (vin: string, field: string, value: string) => {
    setData(vin, { [field]: { stringValue: value } });
  };

  const setIntValue = (vin: string, field: string, value: number | string) => {
    if (typeof value === 'string') {
      if (!value.match(/^[0-9]*$/)) return;
      value = parseInt(value);
    }
    setData(vin, { [field]: { intValue: value } });
  };

  const setFloatValue = (vin: string, field: string, value: number | string) => {
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (!value.match(/^-?[0-9]*(\.[0-9]*)?$/)) return;
    setData(vin, { [field]: { floatValueInternal: value } });
  };

  const setShiftState = (vin: string, field: string, value: ShiftState) => {
    setData(vin, { [field]: { shiftState: value } });
  };

  const setChargeState = (vin: string, field: string, value: ChargeState) => {
    setData(vin, { [field]: { chargeState: value } });
  };

  const newVehicle = (vin: string, cert: string, key: string) => {
    setFleetData((d) => ({
      ...d,
      [vin]: { data: {}, key, cert },
    }));
  };

  const setKey = (vin: string, key: string) => {
    setFleetData((d) => ({
      ...d,
      [vin]: { ...d[vin], key },
    }));
  };
  const setCert = (vin: string, cert: string) => {
    setFleetData((d) => ({
      ...d,
      [vin]: { ...d[vin], cert },
    }));
  };

  const changeVin = (oldVin: string, newVin: string) => {
    setFleetData((d) => {
      const newFleetData = { ...d };
      newFleetData[newVin] = newFleetData[oldVin];
      delete newFleetData[oldVin];
      return newFleetData;
    });
  };

  const configureServer = (host: string, port: string) => {
    setServerData({ host, port });
  };

  return (
    <Context.Provider
      value={useMemo(() => ({
        fleetData,
        setStringValue,
        setIntValue,
        setFloatValue,
        setShiftState,
        setChargeState,
        setKey,
        setCert,
        newVehicle,
        changeVin,
        configureServer,
        server: serverData,
        isLoading,
      }), [fleetData, isLoading, serverData])}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
