import path from "path";

import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";

type LambdaApiGatewayStackProps = cdk.StackProps & {
  /**
   * The __dirname at the root of the service
   */
  dirname: string;
};

export class LambdaApiGatewayStack extends cdk.Stack {
  lambdas: lambda.Function[] = [];
  dirname: string;

  constructor(scope: cdk.App, id: string, props: LambdaApiGatewayStackProps) {
    super(scope, id, props);

    this.dirname = props.dirname;
  }

  /**
   * Prepares a lambda function with all the necessary environment
   * variables, permissions and standard configuration options.
   */
  makeLambda = (
    lambdaName: string,
    lambdaHandler: string,
    options: Partial<lambda.FunctionProps> = {}
  ) => {
    const lambdaFn = new lambda.Function(this, lambdaName, {
      code: new lambda.AssetCode(path.join(this.dirname, ".build")),
      handler: lambdaHandler,
      runtime: lambda.Runtime.NODEJS_8_10,
      environment: {},
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      ...options,
    });
    this.lambdas.push(lambdaFn);
    return lambdaFn;
  };

  /**
   * Prepares a lambda function and returns an integration ready for
   * attaching to an API gateway.
   */
  makeLambdaIntegration = (
    /** The name of the handler file in the lambdas directory, omit the extension */
    name: string,
    /** The name of the exported handler */
    handler: string = "handler"
  ): apigateway.LambdaIntegration => {
    const lambdaFn = this.makeLambda(name, handler);
    return new apigateway.LambdaIntegration(lambdaFn);
  };
}
