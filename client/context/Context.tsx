"use client";
import { useEffect, useState } from "react";
import { AppContext, DataStore, FleetData, KeyData, ServerData } from "./types";

type ContextProviderProps = {
  children: React.ReactNode;
  Context: React.Context<AppContext | undefined>;
  dataStore: DataStore;
};

const defaultData = {
  Gear: { intValue: 2 },
  VehicleName: { stringValue: "First Vehicle" },
};

const ContextProvider = ({
  Context,
  children,
  dataStore,
}: ContextProviderProps) => {
  const [fleetData, setFleetData] = useState<FleetData>({});
  const [serverData, setServerData] = useState<ServerData>({
    host: "",
    port: "",
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
    setFleetData((d) => {
      return {
        ...d,
        [vin]: {
          ...d[vin],
          data: { ...(d[vin].data || {}), ...updated },
        },
      };
    });
  };

  const setStringData = (vin: string, field: string, value: string) => {
    setData(vin, { [field]: { stringValue: value } });
  };

  const setIntData = (vin: string, field: string, value: number) => {
    setData(vin, { [field]: { intValue: value } });
  };

  const newVehicle = (vin: string) => {
    setFleetData((d) => ({
      ...d,
      [vin]: { data: defaultData, key: "", cert: "" },
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
      value={{
        fleetData,
        setStringData,
        setIntData,
        setKey,
        setCert,
        newVehicle,
        changeVin,
        configureServer,
        server: serverData,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
