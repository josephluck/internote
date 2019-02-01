import * as serverless from "serverless-http";
import { connectToDatabase } from "./dependencies/db";
import { startApp } from "./app";

export async function handler(event, context) {
  const db = await connectToDatabase();
  const app = startApp(db);
  const lambda = serverless(app);
  return lambda(event, context).then(response => {
    db.close();
    return response;
  });
}
