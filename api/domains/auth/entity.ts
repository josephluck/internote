import { User } from "../user/entity";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface Session {
  user: User;
  token: any;
}
