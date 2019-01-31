import { Entity, Column, ManyToOne } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../validation";
import { UserEntity } from "../user/entity";

@Entity()
export class NoteEntity extends Base {
  @Column()
  content: string;

  // TODO: this can be non nullable if we clean up data
  @Column({ nullable: true })
  title?: string;

  @ManyToOne(() => UserEntity, user => user.notes, {
    eager: true,
    onDelete: "CASCADE"
  })
  user: UserEntity;
}

const temporary = new NoteEntity();

export type Note = typeof temporary;
export type CreateNote = Omit<
  Partial<Note>,
  "user" | "id" | "dateCreated" | "dateUpdated"
>;
export type UpdateNote = CreateNote;

function defaultNoteContent() {
  return "<h2>Internote</h2><p></p><p>Internote is a rich text editor designed for distraction-free content creation.</p><p></p><p>Internote supports a myriad of different formatting options including <strong>bold, </strong><em>italic </em>and <u>underline</u> as well as lists, <code>code snippets</code>, headings and quotes.</p><p></p><p>Internote automatically saves your notes in the cloud and is completely free.</p>";
}

export function createNote(fields: any, user: UserEntity) {
  return validate<CreateNote>(fields, {
    content: [rules.required]
  }).map(fields => {
    return {
      ...new NoteEntity(),
      ...fields,
      content: fields.content
        ? fields.content
        : `<h1>${fields.title ||
            "New note"}</h1><p></p>${defaultNoteContent()}`,
      user
    };
  });
}
