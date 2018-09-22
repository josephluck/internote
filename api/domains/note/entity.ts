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
    eager: true
  })
  user: UserEntity;
}

const temporary = new NoteEntity();

export type Note = typeof temporary;
export type CreateNote = Omit<
  Note,
  "user" | "id" | "dateCreated" | "dateUpdated"
>;

export async function createNote(fields: CreateNote, user: UserEntity) {
  return validate(fields, {
    content: [rules.required]
  }).map(async fields => {
    return {
      ...new NoteEntity(),
      ...fields,
      user
    };
  });
}
