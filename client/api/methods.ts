// TODO: define this through environment variables
const baseUrl = "http://localhost:8080";

class Methods {
    static async post(path: string, init?: RequestInit) {
        return fetch(
            `${baseUrl}${path}`,
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
    static async get(path: string, init?: RequestInit) {
        return fetch(
            `${baseUrl}${path}`,
            {
                ...(init ?? {}),
            }
        );
    }
    static async delete(path: string, init?: RequestInit) {
        return fetch(
            `${baseUrl}${path}`,
            {
                method: 'DELETE',
                ...(init ?? {}),
            }
        );
    }
}
export default Methods;
