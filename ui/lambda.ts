import * as next from "next";
import * as serverless from "serverless-http";
import * as express from "express";

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();

export async function handler(event, context) {
  await nextApp.prepare();
  const app = express().get("*", (req, res) => handle(req, res));
  const lambda = serverless(app);
  return lambda(event, context);
}
