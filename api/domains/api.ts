import axios, { AxiosRequestConfig } from "axios";
import user from "./user/api";
import auth from "./auth/api";
// import notes from "./notes/api";

export function api(baseURL: string) {
  const client = axios.create({
    headers: { "Content-Type": "application/json" },
    baseURL
  });

  return {
    user: user(client),
    auth: auth(client)
    // notes: notes(client),
  };
}

export function makeAuthHeader(token: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function makeRequestConfig({
  token
}: {
  token: string;
}): AxiosRequestConfig {
  return {
    headers: {
      ...makeAuthHeader(token)
    }
  };
}

export default api;
