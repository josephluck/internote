import { Handler, APIGatewayProxyEvent } from "aws-lambda";
import { Result } from "space-lift";
import { HttpResponseError } from "./errors";

export interface UpdateEvent<T> extends Omit<APIGatewayProxyEvent, "body"> {
  body: T;
}

export type UpdateHandler<T> = Handler<UpdateEvent<T>>;

export type GetHandler = Handler<APIGatewayProxyEvent>;

export type ApiResponse<T> = Promise<Result<HttpResponseError, T>>;
