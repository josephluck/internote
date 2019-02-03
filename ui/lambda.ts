import * as serverless from "serverless-http";
import app from "./server";

export async function handler(event, context) {
  const lambda = serverless(app);
  return lambda(event, context).then(response => {
    console.log({ response });
    return response;
  });
}
