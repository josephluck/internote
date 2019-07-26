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
