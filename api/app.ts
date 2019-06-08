import "reflect-metadata";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";
import * as auth from "koa-jwt";
import * as jwt from "jsonwebtoken";
import * as logger from "koa-pino-logger";
import { Connection } from "typeorm/connection/Connection";
import makeRouter from "./domains/router";
import exceptions from "./dependencies/exceptions";
import messages from "./dependencies/messages";

export interface Dependencies {
  db: Connection;
  auth: auth.Middleware;
  jwt: typeof jwt;
  messages: typeof messages;
}

export function startApp(db: Connection) {
  const app = new Koa();

  const router = makeRouter({
    db,
    auth: auth({
      secret: process.env.JWT_SECRET!
    }),
    jwt,
    messages
  });

  app.use(logger());

  app.use(
    cors({
      origin: "*"
    })
  );

  app.use(bodyParser());

  app.use(router.routes());

  app.use(router.allowedMethods());

  app.use(exceptions());

  return app;
}
