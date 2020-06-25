import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-api-integration";

import { SpeechHandlerEnvironment } from "./env";

type SpeechStackProps = cdk.StackProps & {
  api: apigateway.RestApi;
  cognitoAuthorizer: apigateway.IAuthorizer;
  authenticatedRole: iam.Role;
};

export class InternoteSpeechStack extends cdk.Stack {
  private rootResource: apigateway.Resource;

  constructor(scope: cdk.App, id: string, props: SpeechStackProps) {
    super(scope, id, { ...props });

    this.rootResource = props.api.root.addResource("speech");

    const bucket = new s3.Bucket(this, `${id}-audio-files-bucket`, {
      bucketName: `${id}-audio-files-bucket`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * Ensure only authenticated users can read from the bucket.
     * TODO: support only the current user's portion of the bucket using
     * objectsKeyPattern
     */
    bucket.grantRead(props.authenticatedRole);

    const environment: SpeechHandlerEnvironment = {
      SPEECH_BUCKET_NAME: bucket.bucketName,
      SERVICES_REGION: "eu-west-1", // TODO: get this from context?
    };

    const speechLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-speech-handler-lambda`,
      {
        dirname: __dirname,
        name: "speech",
        handler: "handler",
        options: {
          functionName: `${id}-speech-handler`,
          environment,
        },
      }
    );

    this.rootResource.addMethod("POST", speechLambda.lambdaIntegration, {
      authorizer: props.cognitoAuthorizer,
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
