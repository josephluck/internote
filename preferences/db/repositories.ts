import { db } from "./db";
import { Preferences } from "./models";

export const PreferencesRepository = db
  .define(Preferences, {
    tableName: process.env.TABLE_NAME,
    partitionKey: "id",
  })
  .getInstance();
