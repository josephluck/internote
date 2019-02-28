import axios, { AxiosRequestConfig } from "axios";
import user from "./user/api";
import auth from "./auth/api";
import note from "./note/api";
import preferences from "./preferences/api";
import speech from "./speech/api";

export function api(baseURL: string) {
  const client = axios.create({
    headers: { "Content-Type": "application/json" },
    baseURL
  });

  return {
    user: user(client),
    auth: auth(client),
    note: note(client),
    preferences: preferences(client),
    speech: speech(client),
    interceptors: client.interceptors
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
