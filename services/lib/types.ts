import { Handler, APIGatewayProxyEvent } from "aws-lambda";

export interface UpdateEvent<T> extends Omit<APIGatewayProxyEvent, "body"> {
  body: T;
}

export type UpdateHandler<T> = Handler<UpdateEvent<T>>;

export type GetHandler = Handler<APIGatewayProxyEvent>;
