import path from "path";
import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { env, Env } from "@collect/infra/private-env";

export interface Options {
  stackName: string;
  dynamoTableEnvKey: keyof Env;
}

export class CrudStack extends cdk.Stack {
  api: apigateway.RestApi;
  rootApiResource: apigateway.Resource;
  singleApiResource: apigateway.Resource;
  dynamoTable: dynamodb.Table;
  lambdas: lambda.Function[] = [];
  options: Options;
  dirname: string;

  constructor(
    scope: cdk.App,
    id: string,
    props: cdk.StackProps,
    options: Options,
    dirname: string,
    api: apigateway.RestApi
  ) {
    super(scope, id, props);
    this.api = api;
    this.options = options;
    this.dirname = dirname;
  }

  /**
   * Creates API gateway resources for this stack
   * to attach lambdas to.
   */
  createApiGatewayResources = ({
    rootApiResourceName,
    singleApiResourceName
  }: {
    rootApiResourceName: string;
    singleApiResourceName: string;
  }) => {
    this.rootApiResource = this.api.root.addResource(rootApiResourceName);
    this.singleApiResource = this.rootApiResource.addResource(
      singleApiResourceName
    );
  };

  /**
   * Creates persistence resources for this stack
   */
  createPersistence = ({
    partitionKey,
    tableName
  }: {
    partitionKey: string;
    tableName: string;
  }) => {
    this.dynamoTable = new dynamodb.Table(
      this,
      `${this.options.stackName}DynamoTable`,
      {
        partitionKey: {
          name: partitionKey,
          type: dynamodb.AttributeType.STRING
        },
        tableName,
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
      }
    );
  };

  /**
   * Attaches persistence permissions to given lambda functions
   */
  addPersistencePermissionsToLambdas = (lambdas: lambda.Function[]) => {
    lambdas.forEach(lambdaFn => {
      this.dynamoTable.grantReadWriteData(lambdaFn);
    });
  };

  /**
   * Creates the standard CRUD lambda handlers attached to the API
   * gateway.
   */
  createCrudLambdas = ({
    createLambdaName = "create.handler",
    listLambdaName = "list.handler",
    findLambdaName = "find.handler",
    updateLambdaName = "update.handler",
    deleteLambdaName = "delete.handler"
  }: {
    createLambdaName?: string;
    listLambdaName?: string;
    findLambdaName?: string;
    updateLambdaName?: string;
    deleteLambdaName?: string;
  }) => {
    // CREATE
    const createLambdaIntegration = this.makeLambdaIntegration(
      `Create${this.options.stackName}LambdaFunction`,
      createLambdaName
    );
    this.rootApiResource.addMethod("POST", createLambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE
    });

    // READ
    const listLambdaIntegration = this.makeLambdaIntegration(
      `List${this.options.stackName}LambdaFunction`,
      listLambdaName
    );
    this.rootApiResource.addMethod("GET", listLambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE
    });
    const findLambdaIntegration = this.makeLambdaIntegration(
      `Find${this.options.stackName}LambdaFunction`,
      findLambdaName
    );
    this.singleApiResource.addMethod("GET", findLambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE
    });

    // UPDATE
    const updateLambdaIntegration = this.makeLambdaIntegration(
      `Update${this.options.stackName}LambdaFunction`,
      updateLambdaName
    );
    this.singleApiResource.addMethod("PUT", updateLambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE
    });

    // DELETE
    const deleteLambdaIntegration = this.makeLambdaIntegration(
      `Delete${this.options.stackName}LambdaFunction`,
      deleteLambdaName
    );
    this.singleApiResource.addMethod("DELETE", deleteLambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE
    });
  };

  /**
   * Creates lambdas that _aren't_ user-facing i.e. lambdas that
   * subscribe to event streams, queues etc.
   */
  createEventLambdas = ({
    syncToEsLambdaName = "sync-to-es.handler"
  }: {
    syncToEsLambdaName: string;
  }) => {
    const syncToElasticSearchLambda = this.makeLambda(
      `Sync${this.options.stackName}ToElasticSearchLambdaFunction`,
      syncToEsLambdaName,
      { reservedConcurrentExecutions: 1 }
    );
    syncToElasticSearchLambda.addEventSource(
      new DynamoEventSource(this.dynamoTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON
      })
    );
  };

  /**
   * Prepares a lambda function with all the necessary environment
   * variables, permissions and standard configuration options.
   */
  makeLambda = (
    lambdaName: string,
    lambdaHandler: string,
    opts: Partial<lambda.FunctionProps> = {}
  ) => {
    const environment: Env & Record<string, string> = {
      ...env,
      [this.options.dynamoTableEnvKey]: this.dynamoTable.tableName
      // TODO: figure out how to inject the ES domain config
    };
    const lambdaFn = new lambda.Function(this, lambdaName, {
      code: new lambda.AssetCode(path.join(this.dirname, ".build")),
      handler: lambdaHandler,
      runtime: lambda.Runtime.NODEJS_8_10,
      environment,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      ...opts
    });

    this.lambdas.push(lambdaFn);

    return lambdaFn;
  };

  /**
   * Prepares a lambda function and returns an integration ready for
   * attaching to an API gateway.
   */
  makeLambdaIntegration = (lambdaName: string, lambdaHandler: string) => {
    const lambdaFn = this.makeLambda(lambdaName, lambdaHandler);
    return new apigateway.LambdaIntegration(lambdaFn);
  };
}
