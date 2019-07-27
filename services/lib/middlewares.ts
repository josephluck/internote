import { validate, Constraints } from "@internote/lib/validator";
import { MiddlewareObject } from "middy";
import { badRequest } from "./responses";

export const validateRequestBody = <M extends Record<string, any>>(
  constraints: Constraints<M>
): MiddlewareObject<any, any> => ({
  before: (handler, next) => {
    console.log("Validating preferences", handler.event.body);
    validate(constraints, handler.event.body).fold(
      err => {
        console.log("Validation failed");
        throw badRequest(err);
      },
      () => {
        console.log("Validation successful");
        next();
      }
    );
  }
});

/**
 * Encodes lambda responses as strings for compatibility with API Gateway
 */
export const encodeResponse: middy.Middleware<{}> = () => {
  const transform: middy.MiddlewareFunction<any, any> = (handler, next) => {
    if (
      handler.response &&
      handler.response.body &&
      typeof handler.response.body !== "string"
    ) {
      console.log("Stringifying response body");
      handler.response.body = JSON.stringify(handler.response.body);
    }
    if (
      handler.response &&
      handler.response.error &&
      handler.response.error.message &&
      typeof handler.response.error.message !== "string"
    ) {
      console.log("Stringifying response error", handler.response);
      handler.response.error.message = JSON.stringify(
        handler.response.error.message
      );
    }

    return next();
  };
  return {
    after: transform,
    onError: transform
  };
};
