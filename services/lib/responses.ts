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
