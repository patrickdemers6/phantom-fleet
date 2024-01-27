class Methods {
  static async post(path: string, init?: RequestInit) {
    return fetch(
      `${process.env.NEXT_PUBLIC_PHANTOM_FLEET_API_URL as string}${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
        ...(init ?? {}),
      }
    );
  }
}
export default Methods;
