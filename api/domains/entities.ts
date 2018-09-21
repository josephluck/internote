import { UserEntity } from "./user/entity";
export { UserEntity } from "./user/entity";

import { NoteEntity } from "./note/entity";
export { NoteEntity } from "./note/entity";

export function all() {
  return [UserEntity, NoteEntity];
}

export default all;
