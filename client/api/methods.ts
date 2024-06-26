const base = process.env.NODE_ENV === 'test' ? 'http://localhost:8080/api/1' : '/api/1';

class Methods {
    static async post(path: string, init?: RequestInit) {
        return fetch(
            `${base}${path}`,
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
            `${base}${path}`,
            {
                ...(init ?? {}),
            }
        );
    }
    static async delete(path: string, init?: RequestInit) {
        return fetch(
            `${base}${path}`,
            {
                method: 'DELETE',
                ...(init ?? {}),
            }
        );
    }
}
export default Methods;
