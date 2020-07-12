import { Constraints, validate } from "@internote/lib/validator";
import middy from "@middy/core";
import HttpError from "http-errors";

import { HttpResponseError, mapStatusCodeToErrorType } from "./errors";

export const validateRequestBody = <M extends Record<string, any>>(
  constraints: Constraints<M>
): middy.MiddlewareObject<any, any> => ({
  before: (handler, next) => {
    return validate(constraints, handler.event.body).fold(
      (err) => {
        const error = new HttpError.BadRequest("Invalid request");
        error.detail = err;
        throw error;
      },
      () => {
        return next();
      }
    );
  },
});

/**
 * Encodes lambda responses as strings for compatibility with API Gateway
 */
export const encodeResponse: middy.Middleware<{}> = () => {
  return {
    after: (handler, next) => {
      if (
        handler.response &&
        handler.response.body &&
        typeof handler.response.body !== "string"
      ) {
        handler.response.body = JSON.stringify(handler.response.body);
      }

      return next();
    },
  };
};

/**
 * Encodes errors as valid JSON http errors.
 * see: http://jsonapi.org/examples/#error-objects-basics
 */
export const jsonErrorHandler: middy.Middleware<{}> = () => ({
  onError: (handler, next) => {
    const { error } = handler as any;
    if (handler.error instanceof HttpError.HttpError) {
      const errorBody: HttpResponseError = {
        status: error.statusCode,
        type: mapStatusCodeToErrorType(error.status),
        message: error.message,
        detail: error.detail,
      };
      handler.response = {
        ...handler.response,
        statusCode: error.status,
        body: JSON.stringify(errorBody),
      };
      return next();
    }

    return next(error);
  },
});
