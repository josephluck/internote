import { Entity, Column, ManyToOne, ManyToMany } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../dependencies/validation";
import { UserEntity } from "../user/entity";
import { NoteEntity } from "../note/entity";

@Entity()
export class TagEntity extends Base {
  @Column()
  tag: string;

  @ManyToMany(_type => NoteEntity, note => note.tags)
  notes: NoteEntity[];

  @ManyToOne(() => UserEntity, user => user.tags, {
    onDelete: "CASCADE"
  })
  user: UserEntity;
}

const temporary = new TagEntity();

export type Tag = typeof temporary;
export type CreateTag = Omit<
  Partial<Tag>,
  "user" | "notes" | "id" | "dateCreated" | "dateUpdated"
>;

export function createTag(fields: any, user: UserEntity) {
  return validate<CreateTag>(fields, {
    tag: [rules.required]
  }).map(fields => {
    return {
      ...new TagEntity(),
      ...fields,
      user
    };
  });
}
