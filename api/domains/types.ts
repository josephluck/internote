export { User, CreateUser } from "./user/entity";
export { Note, CreateNote } from "./note/entity";
export { Preferences, CreatePreferences } from "./preferences/entity";
export { Session, LoginRequest, SignupRequest } from "./auth/entity";

export interface DictionaryResult {
  word: string;
  type: string;
  description: string;
  synonyms: string[];
}
