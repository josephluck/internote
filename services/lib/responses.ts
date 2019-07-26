import { Callback } from "aws-lambda";

/**
 * Makes a successful lambda response
 */
export function success<J, C extends Callback<{ statusCode: number; body: J }>>(
  json: J,
  callback: C
) {
  return callback(null, {
    statusCode: 200,
    body: json
  });
}

/**
 * Makes a failed lambda response
 */
export function failure<E extends string | Error, C extends Callback<any>>(
  err: E,
  callback: C
) {
  return callback(err);
}
