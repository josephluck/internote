/**
 * Returns the Cognito Federated Identity ID of the
 * user that invoked the lambda.
 */
export function getUserIdentityId(
  /**
   * Event is the lambda event argument.
   *
   * Refer to: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
   */
  event: any
): string {
  return event.requestContext.identity.cognitoIdentityId;
}
