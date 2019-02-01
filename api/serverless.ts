import serverless from "serverless-http";
import { connectToDatabase } from "./dependencies/db";
import { startApp } from "./app";

export async function handler(event, context) {
  const app = startApp(await connectToDatabase());
  const lambda = serverless(app);
  return await lambda(event, context);
}
