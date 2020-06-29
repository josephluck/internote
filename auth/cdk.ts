import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import { InternoteStack } from "@internote/infra/constructs/internote-stack";
import { InternoteLambda } from "@internote/infra/constructs/lambda-fn";

import { AuthEnvironment } from "./env";

type Props = cdk.StackProps & {};

/**
 * Creates the API Gateway that sits in front of the serverless APIs as well as
 * the Cognito bits and bobs.
 */
export class InternoteGatewayStack extends InternoteStack {
  public api: apigateway.RestApi;

  public userPool: cognito.UserPool;
  public userPoolClient: cognito.UserPoolClient;
  public identityPool: cognito.CfnIdentityPool;

  public unauthenticatedRole: iam.Role;
  public authenticatedRole: iam.Role;

  constructor(scope: cdk.App, id: string, props: Props) {
    super(scope, id, props);

    this.api = new apigateway.RestApi(this, `${id}-api-gateway`, {
      restApiName: `${id}-api-gateway`,
      minimumCompressionSize: 1024,
      cloudWatchRole: true,
      deployOptions: {
        // TODO: somehow provide a log group name - the random one isn't easy to find in CloudWatch
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
        stageName: "prod", // TODO: support stage via context
      },
    });

    const env: AuthEnvironment = {
      SES_FROM_ADDRESS: "noreply@internote.app", // TODO: from context?
    };

    const preSignUpLambda = new InternoteLambda(
      this,
      `${id}-auth-pre-sign-up-lambda`,
      {
        dirname: __dirname,
        name: "pre-sign-up",
        options: { functionName: `${id}-auth-pre`, environment: env },
      }
    );

    const createAuthChallengeLambda = new InternoteLambda(
      this,
      `${id}-auth-create-auth-challenge-lambda`,
      {
        dirname: __dirname,
        name: "create-auth-challenge",
        options: {
          functionName: `${id}-auth-create`,
          environment: env,
        },
      }
    );

    const defineAuthChallengeLambda = new InternoteLambda(
      this,
      `${id}-auth-define-auth-challenge-lambda`,
      {
        dirname: __dirname,
        name: "define-auth-challenge",
        options: {
          functionName: `${id}-auth-define`,
          environment: env,
        },
      }
    );

    const verifyAuthChallengeResponseLambda = new InternoteLambda(
      this,
      `${id}-auth-verify-auth-challenge-response-lambda`,
      {
        dirname: __dirname,
        name: "verify-auth-challenge-response",
        options: {
          functionName: `${id}-auth-verify`,
          environment: env,
        },
      }
    );

    this.userPool = new cognito.UserPool(this, `${id}-auth-user-pool`, {
      userPoolName: `${id}-auth-user-pool`,
      mfa: cognito.Mfa.OFF,
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireDigits: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      signInAliases: { email: true },
      lambdaTriggers: {
        preSignUp: preSignUpLambda.lambdaFn,
        createAuthChallenge: createAuthChallengeLambda.lambdaFn,
        defineAuthChallenge: defineAuthChallengeLambda.lambdaFn,
        verifyAuthChallengeResponse: verifyAuthChallengeResponseLambda.lambdaFn,
      },
    });

    /**
     * Enable the code to be e-mailed to the user
     */
    if (createAuthChallengeLambda.lambdaFn.role) {
      createAuthChallengeLambda.lambdaFn.role.addToPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [
            `arn:aws:ses:${this.region}:${this.account}:identity/internote.app`,
          ],
          actions: ["ses:SendEmail"],
        })
      );
    }

    // this.userPoolClient = new cognito.CfnUserPoolClient(
    //   this,
    //   `${id}-auth-user-pool-client`,
    //   {
    //     supportedIdentityProviders: ["COGNITO"],
    //     clientName: `${id}-auth-user-pool-client`,
    //     // allowedOAuthFlowsUserPoolClient: true,
    //     // allowedOAuthFlows: ["code"],
    //     // allowedOAuthScopes: ["email"],
    //     explicitAuthFlows: ["CUSTOM_AUTH_FLOW_ONLY"],
    //     preventUserExistenceErrors: "ENABLED",
    //     generateSecret: false,
    //     refreshTokenValidity: 1,
    //     userPoolId: this.userPool.userPoolId,
    //   }
    // );

    // TODO: is this simpler:
    this.userPoolClient = new cognito.UserPoolClient(
      this,
      `${id}-auth-user-pool-client`,
      {
        userPool: this.userPool,
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
        userPoolClientName: `${id}-auth-user-pool-client`,
        generateSecret: false,
        authFlows: { custom: true, refreshToken: true },
      }
    );

    this.identityPool = new cognito.CfnIdentityPool(
      this,
      `${id}-auth-identity-pool`,
      {
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
      }
    );

    this.unauthenticatedRole = new iam.Role(
      this,
      `${id}-auth-unauthenticated-role`,
      {
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    this.unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["cognito-sync:*"],
        resources: ["*"],
      })
    );

    this.authenticatedRole = new iam.Role(
      this,
      `${id}-auth-authenticated-role`,
      {
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    this.authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cognito-sync:*",
          "cognito-identity:*",
          // TODO: support direct attachment upload using this
        ],
        resources: ["*"],
      })
    );

    /**
     * Allow authenticated users to call our API gateway
     *
     * TODO: something similar to this could be used to protect premium features
     * using Cognito user groups with attached roles.
     */
    this.authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["execute-api:Invoke"],
        resources: [this.api.arnForExecuteApi()],
      })
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      `${id}-auth-role-attachment`,
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          unauthenticated: this.unauthenticatedRole.roleArn,
          authenticated: this.authenticatedRole.roleArn,
        },
      }
    );

    this.exportToSSM("SERVICES_HOST", this.api.url);

    this.exportToSSM("COGNITO_IDENTITY_POOL_ID", this.identityPool.ref);

    this.exportToSSM("COGNITO_USER_POOL_ID", this.userPool.userPoolId);

    this.exportToSSM(
      "COGNITO_USER_POOL_CLIENT_ID",
      this.userPoolClient.userPoolClientId
    );
  }
}
