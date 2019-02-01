import { Entity, Column, OneToMany } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../dependencies/validation";
import * as crypt from "bcryptjs";
import { NoteEntity } from "../note/entity";

@Entity()
export class UserEntity extends Base {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => NoteEntity, note => note.user)
  notes: NoteEntity[];
}

const temporary = new UserEntity();

export type User = typeof temporary;
export type CreateUser = Omit<
  User,
  "notes" | "id" | "dateCreated" | "dateUpdated"
>;

export async function createUser(fields: CreateUser) {
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
