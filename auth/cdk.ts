import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cognito from "@aws-cdk/aws-cognito";
import * as cdk from "@aws-cdk/core";
// import * as iam from "@aws-cdk/aws-iam";
import { InternoteLambdaApiIntegration } from "@internote/infra/constructs/lambda-api-integration";

type Props = cdk.StackProps & {};

/**
 * Creates the API Gateway that sits in front of the serverless APIs as well as
 * the Cognito bits and bobs.
 */
export class InternoteGatewayStack extends cdk.Stack {
  api: apigateway.RestApi;
  authorizer: apigateway.CfnAuthorizer;
  cognitoAuthorizer: apigateway.IAuthorizer;
  userPool: cognito.UserPool;
  userPoolClient: cognito.CfnUserPoolClient;

  constructor(scope: cdk.App, id: string, props: Props) {
    super(scope, id, props);

    this.api = new apigateway.RestApi(this, `${id}-api-gateway`, {
      restApiName: `${id}-api-gateway`,
    });

    const preSignUpLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-auth-pre-sign-up-lambda`,
      {
        dirname: __dirname,
        name: "pre-sign-up",
        options: { functionName: `${id}-auth-pre` },
      }
    );

    const createAuthChallengeLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-auth-create-auth-challenge-lambda`,
      {
        dirname: __dirname,
        name: "create-auth-challenge",
        options: {
          functionName: `${id}-auth-create`,
        },
      }
    );

    const defineAuthChallengeLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-auth-define-auth-challenge-lambda`,
      {
        dirname: __dirname,
        name: "define-auth-challenge",
        options: {
          functionName: `${id}-auth-define`,
        },
      }
    );

    const verifyAuthChallengeResponseLambda = new InternoteLambdaApiIntegration(
      this,
      `${id}-auth-verify-auth-challenge-response-lambda`,
      {
        dirname: __dirname,
        name: "verify-auth-challenge-response",
        options: {
          functionName: `${id}-auth-verify`,
        },
      }
    );

    this.userPool = new cognito.UserPool(this, `${id}-auth-user-pool`, {
      userPoolName: `${id}-auth-user-pool`,
      mfa: cognito.Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireDigits: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      autoVerify: { email: true },
      signInAliases: { username: true, email: true },
      lambdaTriggers: {
        preSignUp: preSignUpLambda.lambdaFn,
        createAuthChallenge: createAuthChallengeLambda.lambdaFn,
        defineAuthChallenge: defineAuthChallengeLambda.lambdaFn,
        verifyAuthChallengeResponse: verifyAuthChallengeResponseLambda.lambdaFn,
      },
    });

    this.userPoolClient = new cognito.CfnUserPoolClient(
      this,
      `${id}-auth-user-pool-client`,
      {
        supportedIdentityProviders: ["COGNITO"],
        clientName: `${id}-auth-user-pool-client`,
        // allowedOAuthFlowsUserPoolClient: true,
        // allowedOAuthFlows: ["code"],
        // allowedOAuthScopes: ["email"],
        explicitAuthFlows: ["CUSTOM_AUTH_FLOW_ONLY"],
        preventUserExistenceErrors: "ENABLED",
        generateSecret: false,
        refreshTokenValidity: 1,
        userPoolId: this.userPool.userPoolId,
      }
    );

    // TODO: is this simpler:
    // this.userPoolClient = new cognito.UserPoolClient(
    //   this,
    //   `${id}-auth-user-pool-client`,
    //   {
    //     userPool: this.userPool,
    //     userPoolClientName: `${id}-auth-user-pool-client`,
    //     generateSecret: false,
    //     authFlows: { custom: true },
    //   }
    // );

    this.authorizer = new apigateway.CfnAuthorizer(
      this,
      `${id}-auth-cognito-authorizer`,
      {
        restApiId: this.api.restApiId,
        name: `${id}-auth-cognito-authorizer`,
        type: apigateway.AuthorizationType.COGNITO,
        identitySource: "method.request.header.Authorization",
        providerArns: [this.userPool.userPoolArn],
      }
    );

    this.cognitoAuthorizer = {
      authorizerId: this.authorizer.ref,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };
  }
}
