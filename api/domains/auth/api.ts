import { Session, LoginRequest, SignupRequest } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";

export function api(client: AxiosInstance) {
  return {
    login(data: LoginRequest): Promise<Session> {
      return client.post("/login", data).then(r => r.data);
    },
    register(data: SignupRequest): Promise<Session> {
      return client.post("/register", data).then(r => r.data);
    },
    session(token: string): Promise<Session> {
      // TODO: should this not return a Promise<Session> ??
      return client
        .get("/session", makeRequestConfig({ token }))
        .then(r => r.data);
    }
  };
}

export default api;
