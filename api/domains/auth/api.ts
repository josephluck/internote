import { LoginResponse, LoginRequest, SignupRequest } from "./entity";
import { User } from "../user/entity";
import { AxiosInstance } from "axios";

export function api(client: AxiosInstance) {
  return {
    login(data: LoginRequest): Promise<LoginResponse> {
      return client.post("/login", data).then(r => r.data);
    },
    register(data: SignupRequest): Promise<LoginResponse> {
      return client.post("/register", data).then(r => r.data);
    },
    session(): Promise<User> {
      return client.get("/session").then(r => r.data);
    }
  };
}

export default api;
