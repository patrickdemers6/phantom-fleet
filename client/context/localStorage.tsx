import { FleetData, ServerData } from "./types";

const KEY = "appData";

const LocalStorage = {
  loadData: async () => {
    const d = localStorage.getItem(KEY);
    if (d) {
      const parsed = JSON.parse(d);
      return { fleetData: parsed.fleetData, serverData: parsed.serverData };
    }
    return { fleetData: {}, serverData: { host: "", port: "" } };
  },

  saveData: async (fleetData: FleetData, serverData: ServerData) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        fleetData,
        serverData,
      })
    );
  },
};

export default LocalStorage;
