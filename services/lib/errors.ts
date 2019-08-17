type DbError = "ItemNotFound";

export function isDbError(err: any, type: DbError) {
  return (
    (err && err.toString() === type) ||
    (err.hasOwnProperty("message") && err.message === type)
  );
}

export type HttpErrorType = "BadRequest" | "InternalServerError" | "Conflict";

export function mapStatusCodeToErrorType(statusCode: number): HttpErrorType {
  switch (statusCode) {
    case 400:
      return "BadRequest";
    case 409:
      return "Conflict";
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
export interface ConflictError extends BaseError {
  type: "Conflict";
}

export interface InternalServerError extends BaseError {
  type: "InternalServerError";
}

export type HttpResponseError =
  | BadRequestError
  | InternalServerError
  | ConflictError;
