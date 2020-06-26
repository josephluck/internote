import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import { addCorsOptions } from "@internote/infra/constructs/cors";
import { InternoteStack } from "@internote/infra/constructs/internote-stack";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-fn";

import { PreferencesEnv } from "./env";

type PreferencesStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;
  authenticatedRole: iam.Role;
};

export class InternotePreferencesStack extends InternoteStack {
  private rootResource: apigateway.Resource;

  constructor(scope: cdk.App, id: string, props: PreferencesStackProps) {
    super(scope, id, { ...props });

    this.rootResource = props.api.root.addResource("preferences");
    addCorsOptions(this.rootResource); // TODO: abstract these two to the API?

    const PREFERENCES_TABLE_PARTITION_KEY = "id";

    const table = new dynamo.Table(this, `${id}-table`, {
      tableName: id,
      partitionKey: {
        name: PREFERENCES_TABLE_PARTITION_KEY,
        type: dynamo.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // TODO: DON'T DO THIS!!!
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
      authorizationType: apigateway.AuthorizationType.IAM,
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
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadWriteData(updateLambda.lambdaFn);

    this.exportToSSM("PREFERENCES_TABLE_NAME", table.tableName);
    this.exportToSSM(
      "PREFERENCES_TABLE_PARTITION_KEY",
      PREFERENCES_TABLE_PARTITION_KEY
    );
  }
}
