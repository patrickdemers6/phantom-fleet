'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppContext, DataStore, FleetData, KeyData, ShiftState, Vin
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const fleetDataRef = useRef<FleetData>(fleetData);
  fleetDataRef.current = fleetData;

  const setFleetDataMerge = (newData: FleetData) => {
    const updated = { ...(fleetDataRef?.current || {}) };
    Object.entries(newData).forEach(([vin, data]) => {
      updated[vin] = updated[vin] || data;
    });
    setFleetData(updated);
  }

  useEffect(() => {
    (async () => {
      await dataStore.loadData(setFleetDataMerge);
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
      await dataStore.saveData(fleetData);
    })();
  }, [fleetData, isLoading]);

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

  const newVehicle = (vin: string) => {
    setFleetData((d) => ({
      ...d,
      [vin]: { data: {} },
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

  const deleteByVin = (vin: Vin) => {
    setFleetData(d => {
      delete d[vin];
      return d;
    });
    dataStore.deleteByVin(vin);
  }

  return (
    <Context.Provider
      value={{
        fleetData,
        setStringValue,
        setIntValue,
        setFloatValue,
        setShiftState,
        newVehicle,
        changeVin,
        deleteByVin,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
