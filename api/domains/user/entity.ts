import { Entity, Column } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../validation";
import * as crypt from "bcryptjs";

@Entity()
export class UserEntity extends Base {
  @Column()
  email: string;

  @Column()
  password: string;
}

const temporary = new UserEntity();

export type User = typeof temporary;
export type CreateUser = Omit<User, "id" | "dateCreated" | "dateUpdated">;

export async function createUser(fields: CreateUser) {
  return validate(fields, {
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
