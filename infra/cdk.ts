import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/core";
import { InternoteSpeechStack } from "@internote/speech-service/cdk";

import { buildServices } from "./build-services";

type InternoteApiGatewayStackProps = cdk.StackProps & {};

class InternoteApiGatewayStack extends cdk.Stack {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;

  constructor(
    scope: cdk.App,
    id: string,
    props: InternoteApiGatewayStackProps = {}
  ) {
    super(scope, id, props);

    this.api = new apigateway.RestApi(this, id, {
      restApiName: "Internote API",
    });

    // TODO: get this from the auth CDK stack (https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/cognito-api-lambda/index.ts#L25)
    this.cognitoAuthorizer = {
      authorizerId: "",
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };
  }
}

export const build = async () => {
  try {
    await buildServices();
  } catch (err) {
    console.log(err);
    throw err;
  }

  const id = `internote`; // TODO: stage?
  const props = {};
  const app = new cdk.App();

  const { api, cognitoAuthorizer } = new InternoteApiGatewayStack(
    app,
    `${id}-api-gateway-service`,
    props
  );

  const speechStack = new InternoteSpeechStack(app, `${id}-speech-service`, {
    ...props,
    api,
    cognitoAuthorizer,
  });

  console.log(speechStack.toString());

  // app.synth();
};

build();
