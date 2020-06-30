import path from "path";

import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deployment from "@aws-cdk/aws-s3-deployment";
import * as cdk from "@aws-cdk/core";

type Props = cdk.StackProps & {};

export class InternoteUiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const assetsBucket = new s3.Bucket(scope, `${id}-static-assets-bucket`);

    new s3deployment.BucketDeployment(this, `${id}-website`, {
      sources: [s3deployment.Source.asset("./.next")],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "static",
    });

    const coreEdgeFn = new lambda.Function(this, `${id}-core-edge-fn`, {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join("./TODO")),
    });

    new cloudfront.CloudFrontWebDistribution(
      scope,
      `${id}-cloudfront-distribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: assetsBucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                    lambdaFunction: coreEdgeFn.latestVersion,
                  },
                ],
              },
            ],
          },
          {
            s3OriginSource: {
              s3BucketSource: assetsBucket,
            },
            behaviors: [{ pathPattern: "_next/*" }],
          },
        ],
      }
    );
  }
}
