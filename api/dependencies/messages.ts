import * as Router from "koa-router";

export interface ApiMessage {
  type: "error" | "okay";
  code: number;
  message: string;
}

export default {
  throw(ctx: Router.IRouterContext, message: ApiMessage) {
    ctx.throw(message.code, message);
  },
  notFound(message: string): ApiMessage {
    return {
      type: "error",
      code: 404,
      message: `Not found: ${message}`
    };
  },
  badRequest(message: string): ApiMessage {
    return {
      type: "error",
      code: 400,
      message: `Bad request: ${message}`
    };
  },
  serverError(message: string): ApiMessage {
    return {
      type: "error",
      code: 404,
      message: `Internal server error: ${message}`
    };
  },
  successfullyDeleted(message: string): ApiMessage {
    return {
      type: "okay",
      code: 200,
      message: `Deleted: ${message}`
    };
  }
};
