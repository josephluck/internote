import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import {
  InternoteProps,
  InternoteStack,
} from "@internote/infra/constructs/internote-stack";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-fn";

import { DictionaryHandlerEnvironment } from "./env";

type DictionaryStackProps = InternoteProps & {
  api: apigateway.RestApi;
  authenticatedRole: iam.Role;
};

export class InternoteDictionaryStack extends InternoteStack {
  private rootResource: apigateway.Resource;

  constructor(scope: cdk.Construct, id: string, props: DictionaryStackProps) {
    super(scope, id, props);

    this.rootResource = props.api.root.addResource("dictionary");

    const environment: DictionaryHandlerEnvironment = {
      OXFORD_API_ID: this.importFromSSM("OXFORD_API_ID"),
      OXFORD_API_KEY: this.importFromSSM("OXFORD_API_KEY"),
      SERVICES_REGION: "eu-west-1", // TODO: get this from context?
    };

    const lookupLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-lookup-handler-lambda`,
      {
        dirname: __dirname,
        name: "lookup",
        handler: "handler",
        options: {
          functionName: `${id}-lookup-handler`,
          environment,
        },
      }
    );

    this.rootResource.addMethod("POST", lookupLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
  }
}
