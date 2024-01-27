"use client";
import { createContext, useContext } from "react";
import { AppContext, DataStore } from "./types";
import LocalStorage from "./localStorage";
import ContextProvider from "./Context";

const context = createContext<AppContext | undefined>(undefined);

const contextProviders = {
  localStorage: LocalStorage,
};

type ContextProvider = "localStorage" | "mock";

const ApplicationProvider = ({
  contextProvider,
  children,
  dataStore,
}: {
  contextProvider: ContextProvider;
  children: React.ReactNode;
  dataStore?: DataStore;
}) => {
  if (contextProvider === "mock") {
    if (!dataStore) {
      throw new Error(
        "dataStore must be provided when using mock context provider"
      );
    }
    return (
      <ContextProvider Context={context} dataStore={dataStore}>
        {children}
      </ContextProvider>
    );
  }
  return (
    <ContextProvider
      Context={context}
      dataStore={contextProviders[contextProvider]}
    >
      {children}
    </ContextProvider>
  );
};

export const useApp = () => {
  const c = useContext(context);
  if (!c) {
    throw new Error("useData must be used within a LocalstorageProvider");
  }
  return c;
};

export default ApplicationProvider;
