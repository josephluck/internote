import { Note } from "./models";
import { db } from "./db";

export const NotesRepository = db
  .define(Note, {
    tableName: process.env.TABLE_NAME,
    partitionKey: "userId",
    sortKey: "id"
  })
  .getInstance();
