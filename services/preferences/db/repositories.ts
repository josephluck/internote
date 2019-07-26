import { Preferences } from "./models";
import { db } from "./db";

export const PreferencesRepository = db
  .define(Preferences, {
    tableName: process.env.TABLE_NAME,
    partitionKey: "id"
  })
  .getInstance();
