import { Preferences } from "./models";
import { db } from "./db";

export const PreferencesRepository = db
  .define(Preferences, {
    tableName: "PreferencesTable",
    partitionKey: "id"
  })
  .getInstance();
