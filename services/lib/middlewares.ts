import { Constraints } from "mandle";
import { validate } from "@internote/lib/validator";
import { badRequest } from "./responses";
import { MiddlewareObject } from "middy";

export const validateRequestBody = <F extends object>(
  constraints: Constraints<F>
): MiddlewareObject<any, any> => ({
  before: (handler, next) => {
    validate(handler.event.body, constraints).fold(
      err => badRequest(err, handler.callback),
      next
    );
  }
});

export const ensureJSONResponse: middy.Middleware<{}> = () => ({
  after: (handler, next) => {
    if (typeof handler.response.body !== "string") {
      handler.response.body = JSON.stringify(handler.response.body);
    }

    return next();
  }
});
