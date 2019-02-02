"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const next = require("next");
const serverless = require("serverless-http");
const express = require("express");
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();
async function handler(event, context) {
    await nextApp.prepare();
    const app = express().get("*", (req, res) => handle(req, res));
    const lambda = serverless(app);
    return lambda(event, context);
}
exports.handler = handler;
//# sourceMappingURL=lambda.js.map