import { env } from "../env";
import { db } from "./db";
import { Note } from "./models";

export const NotesRepository = db
  .define(Note, {
    tableName: env.NOTES_TABLE_NAME,
    sortKey: env.NOTES_TABLE_SORT_KEY,
    partitionKey: env.NOTES_TABLE_PARTITION_KEY,
  })
  .getInstance();
