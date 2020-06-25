import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-api-integration";

import { PreferencesEnv } from "./env";

type SpeechStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;
  authenticatedRole: iam.Role;
};

export class InternoteSpeechStack extends cdk.Stack {
  private rootResource: apigateway.Resource;

  constructor(scope: cdk.App, id: string, props: SpeechStackProps) {
    super(scope, id, { ...props });

    this.rootResource = props.api.root.addResource("preferences");

    const PREFERENCES_TABLE_PARTITION_KEY = "id";

    const table = new dynamo.Table(this, `${id}-table`, {
      tableName: id,
      partitionKey: PREFERENCES_TABLE_PARTITION_KEY,
      pointInTimeRecovery: true,
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
    });

    const environment: PreferencesEnv = {
      SERVICES_REGION: "eu-west-1", // TODO: from context?
      DYNAMO_ENDPOINT: "https://dynamodb.eu-west-1.amazonaws.com", // TODO: from context?
      PREFERENCES_TABLE_NAME: table.tableName,
      PREFERENCES_TABLE_PARTITION_KEY,
    };

    const getLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-get-lambda`,
      {
        dirname: __dirname,
        name: "get",
        handler: "handler",
        options: {
          functionName: `${id}-get`,
          environment,
        },
      }
    );
    this.rootResource.addMethod("GET", getLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadData(getLambda.lambdaFn);

    const updateLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-update-lambda`,
      {
        dirname: __dirname,
        name: "update",
        handler: "handler",
        options: {
          functionName: `${id}-update`,
          environment,
        },
      }
    );
    this.rootResource.addMethod("PUT", updateLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadWriteData(updateLambda.lambdaFn);
  }
}
