import path from "path";

import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";

type Props = {
  /**
   * The __dirname at the root of the service
   */
  dirname: string;
  /**
   * The file name of the lambda relative to the dirname
   * TODO: deprecate and use handler
   */
  name: string;
  /**
   * The exported handler. Defaults to "handler"
   */
  handler?: string;
  /**
   * Overrides for default lambda
   */
  options?: Partial<lambda.FunctionProps>;
};

/**
 * Makes a standard Internote lambda function with defaults.
 *
 * Loads asset code in to the lambda according to the dirname, name and handler
 * props provided.
 */
export class InternoteLambda extends cdk.Construct {
  lambdaFn: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id);

    const { dirname, name, handler = "handler", options = {} } = props;

    this.lambdaFn = new lambda.Function(this, name, {
      code: new lambda.AssetCode(path.join(dirname, ".build")),
      handler: `${name}.${handler}`,
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {},
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      ...options,
    });
  }
}

/**
 * Makes a standard Internote lambda function with defaults.
 *
 * Loads asset code in to the lambda according to the dirname, name and handler
 * props provided.
 *
 * Also creates an API Gateway Integration for the lambda.
 */
export class InternoteLambdaApiIntegration extends InternoteLambda {
  lambdaIntegration: apigateway.LambdaIntegration;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    this.lambdaIntegration = new apigateway.LambdaIntegration(this.lambdaFn);
  }
}
