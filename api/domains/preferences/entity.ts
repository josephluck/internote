import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Omit } from "type-zoo";
import Base from "../base-entity";
import { validate, rules } from "../../dependencies/validation";
import { UserEntity } from "../user/entity";

@Entity()
export class PreferencesEntity extends Base {
  @Column({ default: "Internote", nullable: true })
  colorTheme?: string;

  @Column({ default: "Inter", nullable: true })
  fontTheme?: string;

  @Column({ default: false, nullable: true })
  distractionFree?: boolean;

  @OneToOne(() => UserEntity, user => user.preferences, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  user: UserEntity;
}

const temporary = new PreferencesEntity();

export type Preferences = typeof temporary;
export type CreatePreferences = Omit<
  PreferencesEntity,
  "user" | "id" | "dateCreated" | "dateUpdated"
>;
export type UpdatePreferences = CreatePreferences;

export const defaultPreferences: CreatePreferences = {
  colorTheme: "Internote",
  fontTheme: "Inter"
};

export function makeDefaultPreferences(user: UserEntity) {
  return {
    ...new PreferencesEntity(),
    ...defaultPreferences,
    user
  };
}

export function createPreferences(fields: any, user: UserEntity) {
  return validate<CreatePreferences>(fields, {
    colorTheme: [rules.required],
    fontTheme: [rules.required]
  }).map(fields => {
    return {
      ...new PreferencesEntity(),
      ...fields,
      user
    };
  });
}
