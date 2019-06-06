import * as Router from "koa-router";

export interface ApiError {
  type: "error" | "okay" | "overwrite";
  code: number;
  message: string;
}

export default {
  throw(ctx: Router.IRouterContext, message: ApiError) {
    ctx.throw(message.code, message);
  },
  notFound(message: string): ApiError {
    return {
      type: "error",
      code: 404,
      message
    };
  },
  badRequest(message: string): ApiError {
    return {
      type: "error",
      code: 400,
      message
    };
  },
  notAuthenticated(): ApiError {
    return {
      type: "error",
      code: 403,
      message: "Not authorized"
    };
  },
  overwrite(message: string): ApiError {
    return {
      type: "overwrite",
      code: 400,
      message
    };
  },
  serverError(message: string): ApiError {
    return {
      type: "error",
      code: 404,
      message
    };
  },
  successfullyDeleted(message: string): ApiError {
    return {
      type: "okay",
      code: 200,
      message
    };
  }
};
