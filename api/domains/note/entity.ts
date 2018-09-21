import { Entity, Column } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../validation";

@Entity()
export class NoteEntity extends Base {
  @Column()
  content: string;
}

const temporary = new NoteEntity();

export type Note = typeof temporary;
export type CreateNote = Omit<Note, "id" | "dateCreated" | "dateUpdated">;

export async function createNote(fields: CreateNote) {
  return validate(fields, {
    content: [rules.required]
  }).map(async fields => {
    return {
      ...new NoteEntity(),
      ...fields,
    };
  });
}
