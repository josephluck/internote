import { Entity, Column, OneToMany, OneToOne } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../dependencies/validation";
import * as crypt from "bcryptjs";
import { NoteEntity } from "../note/entity";
import { PreferencesEntity } from "../preferences/entity";
import { TagEntity } from "../tag/entity";

@Entity()
export class UserEntity extends Base {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => NoteEntity, note => note.user)
  notes: NoteEntity[];

  @OneToMany(() => TagEntity, tag => tag.user)
  tags: TagEntity[];

  @OneToOne(() => PreferencesEntity, preferences => preferences.user, {
    eager: true
  })
  preferences?: PreferencesEntity;
}

const temporary = new UserEntity();

export type User = typeof temporary;
export type CreateUser = Omit<
  User,
  "notes" | "id" | "dateCreated" | "dateUpdated"
>;
export type UpdateUser = CreateUser;

export function createUser(fields: CreateUser) {
  return validate<CreateUser>(fields, {
    email: [rules.required],
    password: [rules.required]
  }).map(async fields => {
    return {
      ...new UserEntity(),
      ...fields,
      password: await crypt.hash(fields.password, 10)
    };
  });
}
