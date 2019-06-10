import { UserEntity } from "./user/entity";
export { UserEntity } from "./user/entity";

import { NoteEntity } from "./note/entity";
export { NoteEntity } from "./note/entity";

import { TagEntity } from "./tag/entity";
export { TagEntity } from "./tag/entity";

import { PreferencesEntity } from "./preferences/entity";
export { PreferencesEntity } from "./preferences/entity";

export function all() {
  return [UserEntity, NoteEntity, TagEntity, PreferencesEntity];
}

export default all;
