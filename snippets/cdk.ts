import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import {
  InternoteProps,
  InternoteStack,
} from "@internote/infra/constructs/internote-stack";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-fn";

import { SnippetsEnv } from "./env";

type SnippetsStackProps = InternoteProps & {
  api: apigateway.RestApi;
  authenticatedRole: iam.Role;
};

export class InternoteSnippetsStack extends InternoteStack {
  private rootResource: apigateway.Resource;
  private singleResource: apigateway.Resource;

  constructor(scope: cdk.Construct, id: string, props: SnippetsStackProps) {
    super(scope, id, props);

    this.rootResource = props.api.root.addResource("snippets");
    this.singleResource = this.rootResource.addResource("{snippetId}");

    const SNIPPETS_TABLE_PARTITION_KEY = "snippetId";
    const SNIPPETS_TABLE_SORT_KEY = "userId";
    const SNIPPETS_TABLE_USER_ID_INDEX = "snippetIdUserIdIndex";

    const table = new dynamo.Table(this, `${id}-table`, {
      tableName: id,

      partitionKey: {
        name: SNIPPETS_TABLE_PARTITION_KEY,
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: SNIPPETS_TABLE_SORT_KEY,
        type: dynamo.AttributeType.STRING,
      },
      pointInTimeRecovery: true, // TODO: abstract so it's the default
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST, // TODO: abstract so it's the default
      removalPolicy: cdk.RemovalPolicy.DESTROY, // TODO: DON'T DO THIS!!!
    });

    /**
     * Allows querying by userId
     */
    table.addGlobalSecondaryIndex({
      indexName: SNIPPETS_TABLE_USER_ID_INDEX,
      partitionKey: {
        name: SNIPPETS_TABLE_SORT_KEY,
        type: dynamo.AttributeType.STRING,
      },
    });

    const environment: SnippetsEnv = {
      SERVICES_REGION: "eu-west-1", // TODO: from context?
      SNIPPETS_TABLE_NAME: table.tableName,
      SNIPPETS_TABLE_PARTITION_KEY,
      SNIPPETS_TABLE_SORT_KEY,
      SNIPPETS_TABLE_USER_ID_INDEX,
    };

    /**
     * GET a list of snippets
     */
    const listLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-list-lambda`,
      {
        dirname: __dirname,
        name: "list",
        handler: "handler",
        options: {
          functionName: `${id}-list`,
          environment,
        },
      }
    );
    this.rootResource.addMethod("GET", listLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadData(listLambda.lambdaFn);

    /**
     * POST a new snippet
     */
    const createLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-create-lambda`,
      {
        dirname: __dirname,
        name: "create",
        handler: "handler",
        options: {
          functionName: `${id}-create`,
          environment,
        },
      }
    );
    this.rootResource.addMethod("POST", createLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadWriteData(createLambda.lambdaFn);

    /**
     * DELETE a single snippet by it's snippetId
     */
    const deleteLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-delete-lambda`,
      {
        dirname: __dirname,
        name: "delete",
        handler: "handler",
        options: {
          functionName: `${id}-delete`,
          environment,
        },
      }
    );
    this.singleResource.addMethod("DELETE", deleteLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadWriteData(deleteLambda.lambdaFn);

    this.exportToSSM(
      "SNIPPETS_TABLE_PARTITION_KEY",
      SNIPPETS_TABLE_PARTITION_KEY
    );
    this.exportToSSM("SNIPPETS_TABLE_SORT_KEY", SNIPPETS_TABLE_SORT_KEY);
    this.exportToSSM("SNIPPETS_TABLE_NAME", table.tableName);
    this.exportToSSM(
      "SNIPPETS_TABLE_USER_ID_INDEX",
      SNIPPETS_TABLE_USER_ID_INDEX
    );
  }
}
