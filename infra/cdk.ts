import * as cdk from "@aws-cdk/core";
import { InternoteGatewayStack } from "@internote/auth-service/cdk";
import { InternoteSpeechStack } from "@internote/speech-service/cdk";

// import { InternoteApiGatewayStack } from "./api-gateway";
import { buildServices } from "./build-services";

/**
 * TODOS
 *
 * - Build out remaining stacks
 * - Route53
 * - Federated identity for direct S3 upload for attachments
 * - Migration of DynamoDB data from existing infra
 * - Migration of users from existing user pool (https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cognito-readme.html#importing-user-pools)
 * - Automatic population of environment outputs in to SSM
 * - Rename auth workspace to gateway, as it includes gateway and it's a nicer name
 */

export const build = async () => {
  try {
    await buildServices();
  } catch (err) {
    console.log(err);
    throw err;
  }

  const id = `internote-cdk-experiment`; // TODO: stage?
  const props = {};
  const app = new cdk.App();

  const {
    api,
    cognitoAuthorizer,
    authenticatedRole,
  } = new InternoteGatewayStack(app, id, props);

  const speechStack = new InternoteSpeechStack(app, `${id}-speech-service`, {
    ...props,
    api,
    cognitoAuthorizer,
    authenticatedRole,
  });

  console.log(speechStack.toString());

  // app.synth();
};

build();
