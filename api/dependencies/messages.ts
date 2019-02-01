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
  notFound(entity: string): ApiMessage {
    return {
      type: "error",
      code: 404,
      message: `${entity} not found`
    };
  },
  badRequest(message: string): ApiMessage {
    return {
      type: "error",
      code: 400,
      message
    };
  },
  successfullyDeleted(entity: string): ApiMessage {
    return {
      type: "okay",
      code: 200,
      message: `${entity} deleted`
    };
  }
};
