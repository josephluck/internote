/**
 * Makes a successful lambda response
 */
export function success<J>(json: J) {
  return {
    statusCode: 200,
    body: json,
  };
}

/**
 * Makes a bad request lambda response
 */
export function badRequest<J>(json: J) {
  return {
    statusCode: 400,
    message: json,
  };
}

/**
 * Makes a not found lambda response
 */
export function notFound<M extends string>(message: M) {
  return {
    statusCode: 400,
    message: message,
  };
}

/**
 * Makes a failed lambda response
 */
export function exception<E extends string | Error>(err: E) {
  return {
    statusCode: 500,
    message: err,
  };
}
