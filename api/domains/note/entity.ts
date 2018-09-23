import { Entity, Column, ManyToOne } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../validation";
import { UserEntity } from "../user/entity";

@Entity()
export class NoteEntity extends Base {
  @Column()
  content: string;

  @ManyToOne(() => UserEntity, user => user.notes, {
    eager: true,
    onDelete: "CASCADE"
  })
  user: UserEntity;
}

const temporary = new NoteEntity();

export type Note = typeof temporary;
export type CreateNote = Omit<
  Note,
  "user" | "id" | "dateCreated" | "dateUpdated"
>;
export type UpdateNote = CreateNote;

export function createNote(fields: any, user: UserEntity) {
  return validate<CreateNote>(fields, {
    content: [rules.required]
  }).map(fields => {
    return {
      ...new NoteEntity(),
      ...fields,
      user
    };
  });
}
