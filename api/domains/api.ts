import axios from "axios";
import user from "./user/api";
import auth from "./auth/api";

// TODO: refactor the below to accept a token for each endpoint
export function api(token?: string) {
  const authToken = token ? { Authorization: `Bearer ${token}` } : {};
  const client = axios.create({
    headers: { "Content-Type": "application/json", ...authToken },
    baseURL: process.env.API_BASE_URL
  });

  return {
    user: user(client),
    auth: auth(client),
    setToken(token: string) {
      client.defaults.headers = {
        ...client.defaults.headers,
        Authorization: `Bearer ${token}`
      };
    }
  };
}

export default api;
