import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { addCorsOptions } from "@internote/infra/constructs/cors";
import { InternoteStack } from "@internote/infra/constructs/internote-stack";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-fn";

import { ExportHandlerEnvironment } from "./env";

type ExportStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  authenticatedRole: iam.Role;
};

export class InternoteExportStack extends InternoteStack {
  private rootResource: apigateway.Resource;
  private htmlResource: apigateway.Resource;
  private markdownResource: apigateway.Resource;

  constructor(scope: cdk.App, id: string, props: ExportStackProps) {
    super(scope, id, { ...props });

    this.rootResource = props.api.root.addResource("export");
    this.htmlResource = this.rootResource.addResource("html");
    this.markdownResource = this.rootResource.addResource("markdown");

    [this.rootResource, this.htmlResource, this.markdownResource].forEach(
      addCorsOptions
    );

    const bucket = new s3.Bucket(this, `${id}-export-files-bucket`, {
      bucketName: `${id}-export-files-bucket`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * Ensure only authenticated users can read from the bucket.
     * TODO: support only the current user's portion of the bucket using
     * objectsKeyPattern
     */
    bucket.grantRead(props.authenticatedRole);

    const environment: ExportHandlerEnvironment = {
      EXPORT_BUCKET_NAME: bucket.bucketName,
      SERVICES_REGION: "eu-west-1", // TODO: get this from context?
    };

    const htmlLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-html-handler-lambda`,
      {
        dirname: __dirname,
        name: "html",
        handler: "handler",
        options: {
          functionName: `${id}-html-handler`,
          environment,
        },
      }
    );

    this.htmlResource.addMethod("POST", htmlLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });

    const markdownLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-markdown-handler-lambda`,
      {
        dirname: __dirname,
        name: "markdown",
        handler: "handler",
        options: {
          functionName: `${id}-markdown-handler`,
          environment,
        },
      }
    );

    this.markdownResource.addMethod("POST", markdownLambda.lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });

    /**
     * Grants the lambdas read-write access to S3
     */
    [htmlLambda, markdownLambda].forEach((fn) =>
      bucket.grantReadWrite(fn.lambdaFn)
    );

    this.exportToSSM("EXPORT_BUCKET_NAME", bucket.bucketName);
  }
}
