import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../dependencies/validation";
import { UserEntity } from "../user/entity";
import { defaultNote } from "./default-note";
import { TagEntity } from "../tag/entity";

@Entity()
export class NoteEntity extends Base {
  @Column("json", { default: defaultNoteContent() })
  content: {};

  @Column()
  title: string;

  @ManyToMany(_type => TagEntity, tag => tag.notes)
  @JoinTable()
  tags: TagEntity[];

  @ManyToOne(() => UserEntity, user => user.notes, {
    onDelete: "CASCADE"
  })
  user: UserEntity;
}

const temporary = new NoteEntity();

export type Note = typeof temporary;

/**
 * When creating or updating a note, tags are a simple array of strings.
 * This is different to the read model, where tags are an array of
 * TagEntity objects.
 */
export type CreateNote = Omit<
  Partial<Note>,
  "user" | "tags" | "id" | "dateCreated" | "dateUpdated"
> & { tags: string[] };

export type UpdateNote = CreateNote &
  Pick<Note, "dateUpdated"> & { overwrite: boolean };

function defaultNoteContent(): NoteEntity["content"] {
  // TODO: implement a nice default note
  return defaultNote;
}

export function createNote(fields: any, user: UserEntity) {
  return validate<CreateNote>(fields, {
    content: [rules.required]
  }).map(fields => {
    return {
      ...new NoteEntity(),
      ...fields,
      content: fields.content ? fields.content : defaultNoteContent(),
      tags: [],
      user
    };
  });
}

export function updateNote(fields: any, user: UserEntity) {
  return validate<UpdateNote>(fields, {
    content: [rules.required],
    dateUpdated: [rules.required]
  }).map(fields => {
    return {
      ...new NoteEntity(),
      ...fields,
      content: fields.content ? fields.content : defaultNoteContent(),
      user,
      previousDateUpdated: fields.dateUpdated
    };
  });
}
