type ErrorType = "NOT_FOUND";

const statuses: Record<ErrorType, number> = {
  NOT_FOUND: 404
};

function makeError(type: ErrorType, message: string) {
  return { status: statuses[type], message };
}

export function notFoundError(message: string) {
  throw makeError("NOT_FOUND", message);
}

export function isError(err: any, type: ErrorType) {
  return err && err.hasOwnProperty("status") && err.status === statuses[type];
}

type DbError = "ItemNotFound";

export function isDbError(err: any, type: DbError) {
  return (
    (err && err.toString() === type) ||
    (err.hasOwnProperty("message") && err.message === type)
  );
}

export type HttpErrorType = "BadRequest" | "InternalServerError";

export function mapStatusCodeToErrorType(statusCode: number): HttpErrorType {
  switch (statusCode) {
    case 400:
      return "BadRequest";
    case 500:
    default:
      return "InternalServerError";
  }
}

interface BaseError {
  status: number;
  message: string;
}

export interface BadRequestError extends BaseError {
  type: "BadRequest";
  detail: Record<string, string>;
}

export interface InternalServerError extends BaseError {
  type: "InternalServerError";
}

export type HttpResponseError = BadRequestError | InternalServerError;
