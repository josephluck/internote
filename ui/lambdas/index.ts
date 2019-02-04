import * as pageProxy from "aws-serverless-express";
import * as nextLambda from "../.next/serverless/pages/index";

const pageHandler = pageProxy.createServer((req, res) => {
  return (nextLambda as any).render(req, res);
});

module.exports.handler = (event, context) => {
  pageProxy.proxy(pageHandler, event, context);
};
