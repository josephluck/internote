import * as serverlessExpress from "aws-serverless-express";
import server from "./server";

const binaryMimeTypes = [
  "application/javascript",
  "application/json",
  "application/octet-stream",
  "application/xml",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "text/event-stream",
  "text/comma-separated-values",
  "text/css",
  "text/html",
  "text/javascript",
  "text/plain",
  "text/text",
  "text/xml"
];

const app = serverlessExpress.createServer(server, null, binaryMimeTypes);

export function handler(event, context) {
  return serverlessExpress.proxy(app, event, context);
}
