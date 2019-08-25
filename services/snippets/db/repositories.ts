import { Snippet } from "./models";
import { db } from "./db";

export const SnippetsRepository = db
  .define(Snippet, {
    tableName: process.env.TABLE_NAME,
    sortKey: "userId",
    partitionKey: "snippetId"
  })
  .getInstance();
