import { db } from "./db";
import { Note } from "./models";

export const NotesRepository = db
  .define(Note, {
    tableName: process.env.TABLE_NAME,
    sortKey: "userId",
    partitionKey: "noteId",
  })
  .getInstance();
