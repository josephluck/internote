import { CognitoUserPoolTriggerHandler } from "aws-lambda";

export const handler: CognitoUserPoolTriggerHandler = async event => {
  event.response.autoConfirmUser = true;
  (event.response as any).autoVerifyEmail = true;
  return event;
};
