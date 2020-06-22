import { db } from "./db";
import { Snippet } from "./models";

export const SnippetsRepository = db
  .define(Snippet, {
    tableName: process.env.TABLE_NAME,
    sortKey: "userId",
    partitionKey: "snippetId",
  })
  .getInstance();
