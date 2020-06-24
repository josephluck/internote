import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { RemovalPolicy } from "@aws-cdk/core";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-api-integration";

type SpeechStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;
};

export class InternoteSpeechStack extends cdk.Stack {
  rootResource: apigateway.Resource;

  constructor(scope: cdk.App, id: string, props: SpeechStackProps) {
    super(scope, id, { ...props });

    this.rootResource = props.api.root.addResource("speech");

    const speechLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-speech-handler-lambda`,
      {
        dirname: __dirname,
        name: "speech",
        handler: "handler",
        options: { functionName: `${id}-speech-handler` },
      }
    );

    this.rootResource.addMethod("POST", speechLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
    });

    const bucket = new s3.Bucket(this, `${id}-audio-files-bucket`, {
      bucketName: `${id}-audio-files-bucket`,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: true, // TODO: limit to current authenticated user via cognito if possible..
    });

    /**
     * Grants the lambdas read-write access to S3
     */
    bucket.grantReadWrite(speechLambda.lambdaFn);

    /**
     * Grants the lambdas access to polly
     */
    const role = new iam.Role(this, "Role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [speechLambda.lambdaFn.functionArn],
        actions: ["polly:*"],
      })
    );
  }
}
