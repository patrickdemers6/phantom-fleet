import Methods from "./methods";

export const setConfig = async (host: string, port: number) => {
  try {
    const res = await Methods.post("/config", {
      body: JSON.stringify({ host, port }),
    });
    return res.json();
  } catch (e) {
    return { reason: `Unexpected error: ${(e as Error).message}` };
  }
};
