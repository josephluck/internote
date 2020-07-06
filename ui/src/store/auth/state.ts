import { Session, makeAuthStorage } from "../../auth/storage";

const authStorage = makeAuthStorage();

export type SignInSession = {
  email: string;
  session: string;
};

type AuthState = {
  needsVerify: boolean;
  session: Session;
  signInSession: SignInSession;
};

export const authInitialState: AuthState = {
  needsVerify: false,
  session: authStorage.getSession(),
  signInSession: { email: "", session: "" },
};
