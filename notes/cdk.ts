import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import {
  InternoteProps,
  InternoteStack,
} from "@internote/infra/constructs/internote-stack";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-fn";

import { NotesEnv } from "./env";

type NotesStackProps = InternoteProps & {
  api: apigateway.RestApi;
  authenticatedRole: iam.Role;
};

export class InternoteNotesStack extends InternoteStack {
  private rootResource: apigateway.Resource;
  private singleResource: apigateway.Resource;
  private rootResourceTags: apigateway.Resource;

  constructor(scope: cdk.Construct, id: string, props: NotesStackProps) {
    super(scope, id, props);

    this.rootResource = props.api.root.addResource("notes");
    this.singleResource = this.rootResource.addResource("{noteId}");
    this.rootResourceTags = props.api.root.addResource("tags");

    const NOTES_TABLE_PARTITION_KEY = "noteId";
    const NOTES_TABLE_SORT_KEY = "userId";
    const NOTES_TABLE_USER_ID_INDEX = "noteIdUserIdIndex";

    const table = new dynamo.Table(this, `${id}-table`, {
      tableName: id,

      partitionKey: {
        name: NOTES_TABLE_PARTITION_KEY,
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: NOTES_TABLE_SORT_KEY,
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
      indexName: NOTES_TABLE_USER_ID_INDEX,
      partitionKey: {
        name: NOTES_TABLE_SORT_KEY,
        type: dynamo.AttributeType.STRING,
      },
    });

    const environment: NotesEnv = {
      SERVICES_REGION: "eu-west-1", // TODO: from context?
      NOTES_TABLE_NAME: table.tableName,
      NOTES_TABLE_PARTITION_KEY,
      NOTES_TABLE_SORT_KEY,
      NOTES_TABLE_USER_ID_INDEX,
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
      authorizationType: apigateway.AuthorizationType.IAM,
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
      authorizationType: apigateway.AuthorizationType.IAM,
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
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadWriteData(createLambda.lambdaFn);

    /**
     * PUT a single note by it's noteId
     */
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
    this.singleResource.addMethod("PUT", updateLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadWriteData(updateLambda.lambdaFn);

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
      authorizationType: apigateway.AuthorizationType.IAM,
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
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    table.grantReadData(tagsLambda.lambdaFn);

    this.exportToSSM("NOTES_TABLE_PARTITION_KEY", NOTES_TABLE_PARTITION_KEY);
    this.exportToSSM("NOTES_TABLE_SORT_KEY", NOTES_TABLE_SORT_KEY);
    this.exportToSSM("NOTES_TABLE_NAME", table.tableName);
    this.exportToSSM("NOTES_TABLE_USER_ID_INDEX", NOTES_TABLE_USER_ID_INDEX);
  }
}
