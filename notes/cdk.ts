import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-api-integration";

import { NotesEnv } from "./env";

type SpeechStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;
  authenticatedRole: iam.Role;
};

export class InternoteSpeechStack extends cdk.Stack {
  private rootResource: apigateway.Resource;
  private singleResource: apigateway.Resource;
  private rootResourceTags: apigateway.Resource;

  constructor(scope: cdk.App, id: string, props: SpeechStackProps) {
    super(scope, id, { ...props });

    this.rootResource = props.api.root.addResource("notes");
    this.singleResource = this.rootResource.addResource("{noteId}");
    this.rootResourceTags = props.api.root.addResource("tags");

    const NOTES_TABLE_PARTITION_KEY = "noteId";
    const NOTES_TABLE_SORT_KEY = "userId";

    const table = new dynamo.Table(this, `${id}-table`, {
      tableName: id,
      partitionKey: NOTES_TABLE_PARTITION_KEY,
      sortKey: NOTES_TABLE_SORT_KEY,
      pointInTimeRecovery: true, // TODO: abstract so it's the default
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST, // TODO: abstract so it's the default
    });

    const environment: NotesEnv = {
      SERVICES_REGION: "eu-west-1", // TODO: from context?
      DYNAMO_ENDPOINT: "https://dynamodb.eu-west-1.amazonaws.com", // TODO: from context?
      NOTES_TABLE_NAME: table.tableName,
      NOTES_TABLE_PARTITION_KEY,
      NOTES_TABLE_SORT_KEY,
    };

    /**
     * GET a list of notes
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
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadData(listLambda.lambdaFn);

    /**
     * GET a single note by it's noteId
     */
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
    this.singleResource.addMethod("GET", getLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadData(getLambda.lambdaFn);

    /**
     * POST a new note
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
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadWriteData(createLambda.lambdaFn);

    /**
     * PUT a single note by it's noteId
     */
    const putLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-put-lambda`,
      {
        dirname: __dirname,
        name: "put",
        handler: "handler",
        options: {
          functionName: `${id}-put`,
          environment,
        },
      }
    );
    this.singleResource.addMethod("PUT", putLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadWriteData(putLambda.lambdaFn);

    /**
     * DELETE a single note by it's noteId
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
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadWriteData(deleteLambda.lambdaFn);

    /**
     * GET all the tags from the list of notes
     */
    const tagsLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-tags-lambda`,
      {
        dirname: __dirname,
        name: "tags",
        handler: "handler",
        options: {
          functionName: `${id}-tags`,
          environment,
        },
      }
    );
    this.rootResourceTags.addMethod("GET", tagsLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
    });
    table.grantReadData(tagsLambda.lambdaFn);
  }
}
