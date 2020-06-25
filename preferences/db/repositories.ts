import { env } from "../env";
import { db } from "./db";
import { Preferences } from "./models";

export const PreferencesRepository = db
  .define(Preferences, {
    tableName: env.PREFERENCES_TABLE_NAME,
    partitionKey: env.PREFERENCES_TABLE_PARTITION_KEY,
  })
  .getInstance();
