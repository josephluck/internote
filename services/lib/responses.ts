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
 * Makes a bad request lambda response
 */
export function badRequest<
  J,
  C extends Callback<{ statusCode: number; body: J }>
>(json: J, callback: C) {
  return callback(null, {
    statusCode: 400,
    body: json
  });
}

/**
 * Makes a not found lambda response
 */
export function notFound<
  M extends string,
  C extends Callback<{ statusCode: number; body: M }>
>(message: M, callback: C) {
  return callback(null, {
    statusCode: 400,
    body: message
  });
}

/**
 * Makes a failed lambda response
 */
export function exception<E extends string | Error, C extends Callback<any>>(
  err: E,
  callback: C
) {
  return callback(err);
}
