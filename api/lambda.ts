const serverless = require("serverless-http");
import { connectToDatabase } from "./dependencies/db";
import { startApp } from "./app";

export async function handler(event, context) {
  const db = await connectToDatabase();
  try {
    const app = startApp(db);
    const lambda = serverless(app);
    const response = await lambda(event, context);
    db.close();
    return response;
  } catch (err) {
    db.close();
    throw err;
  }
}
