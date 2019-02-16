import { UserEntity } from "./user/entity";
export { UserEntity } from "./user/entity";

import { NoteEntity } from "./note/entity";
export { NoteEntity } from "./note/entity";

import { PreferencesEntity } from "./preferences/entity";
export { PreferencesEntity } from "./preferences/entity";

export function all() {
  return [UserEntity, NoteEntity, PreferencesEntity];
}

export default all;
