import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { LambdaApiGatewayStack } from "@internote/infra/cdk-lambda-gateway-stack";

type SpeechStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;
};

export class InternoteSpeechStack extends cdk.Stack {
  lambdaApiGateway: InternoteSpeechGatewayLambdasStack;

  constructor(scope: cdk.App, id: string, props: SpeechStackProps) {
    super(scope, id, props);

    this.lambdaApiGateway = new InternoteSpeechGatewayLambdasStack(
      scope,
      `${id}-gateway-lambdas`,
      props
    );
  }
}

export class InternoteSpeechGatewayLambdasStack extends LambdaApiGatewayStack {
  rootResource: apigateway.Resource;
  lambdas: lambda.Function[];

  constructor(scope: cdk.App, id: string, props: SpeechStackProps) {
    super(scope, id, { ...props, dirname: __dirname });

    this.rootResource = props.api.root.addResource("speech");

    const speechLambda = this.makeLambdaIntegration("speech");
    this.rootResource.addMethod("POST", speechLambda, {
      authorizer: props.cognitoAuthorizer,
    });
  }
}
