import { CognitoUserPoolTriggerHandler } from "aws-lambda";

export const handler: CognitoUserPoolTriggerHandler = async (event) => {
  event.response.autoVerifyEmail = true;
  event.response.autoConfirmUser = true;
  return event;
};
