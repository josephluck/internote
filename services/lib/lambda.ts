import { Handler, APIGatewayProxyEvent } from "aws-lambda";
import { Result } from "space-lift";
import { HttpResponseError } from "./errors";

export interface UpdateEvent<B, Q extends Record<string, string> = {}>
  extends Omit<APIGatewayProxyEvent, "body" | "pathParameters"> {
  body: B;
  pathParameters: Q;
}

export type UpdateHandler<B, Q extends Record<string, string> = {}> = Handler<
  UpdateEvent<B, Q>
>;

export type CreateHandler<
  B,
  Q extends Record<string, string> = {}
> = UpdateHandler<B, Q>;

export interface GetEvent<Q extends Record<string, string>>
  extends Omit<APIGatewayProxyEvent, "pathParameters"> {
  pathParameters: Q;
}

export type GetHandler<Q extends Record<string, string> = {}> = Handler<
  GetEvent<Q>
>;

export interface DeleteEvent<Q extends Record<string, string>>
  extends Omit<APIGatewayProxyEvent, "pathParameters"> {
  pathParameters: Q;
}

export type DeleteHandler<Q extends Record<string, string> = {}> = Handler<
  DeleteEvent<Q>
>;

export type ApiResponse<T> = Promise<Result<HttpResponseError, T>>;
