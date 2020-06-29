<div align="center">
  <h1>
    <br/>
    <br/>
    ❤️
    <br />
    <br />
    Internote
    <br />
    <br />
    <br />
    <br />
  </h1>
  <br />
  <p>
    Beautiful web-based note editor with a focus on distraction-free content creation.
  </p>
  <br />
  <pre><a href="https://dev.internote.app">https://dev.internote.app</a></pre>
  <br />
  <br />
  <br />
  <br />
</div>

# 🚨 Fair warning!

Internote is currently in **beta** status. This means that it's not ready for production use and your content may be erased at any time. You've been warned!

# Features

Many of Internote's features are free, however some advanced features are offered at a premium subscription.

> Internote is currently in **beta**. During this time, all features are offered for _free_ without subscription. However, be warned that your content may be erased at any time.

## Free

- Rich editor with all the standard formatting options you'd expect
- Emojis
- Rich keyboard shortcuts
- Outline navigation
- Hashtags & rich search
- Distraction-free mode which highlights and centers the content you're focused on
- Real-time automatic saving
- Multiple colour and typography themes
- Full-screen mode
- Passwordless login

## Premium

> Premium has not yet been built and Internote is currently in **beta**. All of the following features are free until Internote is out of beta.

- Integrated oxford dictionary
- Text to speech
- Export as HTML
- Export as Markdown

## Coming soon

- Hyperlinks
- Clickable tags
- File upload
- Public publish
- Offline mode
- Real-time collaboration
- Export as PDF
- Export as DOCX
- Sync to Google Drive / Dropbox
- Native app

# Application stack

## Architecture

Internote is designed as a fully serverless application. This means that both the front-end and the back-end services are stateless, with persistence handled by external file storage and database storage.

Internote's front-end and back-end services are written in Typescript and the project is structured as a mono-repository to make use of efficient code-sharing where useful. For example, API DTOs are written in Typescript and are shared across the front-end and the back-end.

## Local development

Since Internote runs on a serverless stack, it isn't possible (without significant set-up) to run the whole stack locally. Instead, it is advised to rely on unit / integration testing to develop individual services (mocking out any dependent services where necessary). Alternatively, the `dev` stage can be deployed to during development, providing that the risk of data corruption is kept to a minimum.

The front-end application can be run locally and is set up to run against the `dev` stage back-end services. Bear in mind that running locally is not the same as a built version of the front-end so it's advised to deploy and test against the `dev` stage before promoting the build to production.

## Front-end stack

- TypeScript
- React
- Next.js
- Twine
- Styled Components
- Storybook
- Slate
- AWS API Gateway
- AWS Lambda
- AWS S3
- AWS CloudWatch
- AWS CloudFront
- AWS Route53

## Back-end stack

- Middy
- DynamoDB
- Type Dynamo
- AWS Lambda
- AWS S3
- AWS Cognito User Pools
- AWS Cognito Federated Identities
- API Gateway
- AWS CloudWatch
- AWS CloudFront
- AWS Polly
- Oxford Dictionary API

## Back-end services

There are several independent micro-services, each responsible for a portion of the overall back-end. Each service is deployed using AWS CDK and there's a shared library of utilities that are used in multiple services.

The Internote services are organised using a yarn workspaces mono-repository, and maintain autonomy and isolation from one another in terms of deployment and code.

**Auth**

Authentication in Internote is powered by AWS Cognito and follows a password-less experience whereby the user does not set their own password, but instead, receives a one-time pass-code for signing up or signing in via email (SES is used for e-mail sending).

The authentication credentials are used to sign requests to other services using AWS Signing Key Signatures (aws4). These include requests to the API Gateway (backed by AWS lambda) or other AWS services for example S3 using a Cognito Federated Identity.

Most back-end services are authorized using API Gateway's IAM authorization (this means that authorization is handled prior to lambdas that require authorization being invoked). This keeps the concept of authentication and authorization away from the business logic of the underlying lambdas.

The gateway service sets up a Cognito User Pool, Cognito Identity Pool, Cognito User Pool Client and the associated IAM roles and permissions to link them together, as well as the API Gateway that sits in front of the services.

**Attachments**

The attachments service is responsible for facilitating attachment uploads to an S3 bucket for storing inside notes. For example, images and videos.

> It's crucial that the browser uploads these attachments directly to the S3 bucket - doing so via a lambda would be both unnecessary and expensive. Cognito Federated Identities are set up to facilitate the browser doing this securely.

**Notes**

The notes service is responsible for the creation, deletion, listing and management of notes as well as tags.

**Preferences**

The preferences service is responsible for the creation, management and retrieval of user settings such as colour scheme, focus mode etc.

**APIs, DTOs and validation**

Each Internote service defines it's own types for request and response DTOs. These types are consumed by client applications to construct strongly-typed SDKs on top of the services.

**Database**

Each service may use DynamoDB for database-like persistence. Each service is responsible for defining it's own DynamoDB schema and management.

Since DynamoDB is schemaless, attributes that are added to a model after initial set up and deployment are defined as optional attributes and are enforced as such using strict TypeScript compiler options.

**Stages / domains**

CDK is setup with the concept of a "stage" which is an isolated deployment of the entire Internote stack. These stages are used to resemble environments. There are two main "environments" set up, although others can be deployed easily:

- https://dev-services.internote.app
- https://services.internote.app

**API Gateway**

An API Gateway is created by the Serverless framework to route traffic from the internet through to the lambdas that power the back-end services. Each service references this API Gateway in it's CDK set up.

Since the Internote services are designed to be called by a 3rd party client application (such as the front-end that powers the Internote editor), CORS is enabled for every lambda integration to the API gateway.

**Domain / SSL**

The domain and SSL configuration is managed manually through Route53 and AWS Certificate Manager using the AWS console.

SSL certificates are managed by AWS Certificate Manager where a sub-domain wildcard SSL certificate is linked with the API gateway.

**Email**

Amazon SES is used to send e-mails to users. Typically `no-reply@internote.app` is used as the sending address.

> Note that SES is set up outside the context of the CDK application manually through the AWS console.

**Receiving email**

There is no facility for Internote to receive e-mail from users.

# Deployment

#### Set up

- Create an AWS account.
- Create an IAM policy that has full access to AWS.
- Create an IAM profile and attach the above role to it. Call it something like `internote-cdk`.
- Add the access & secret keys to a new profile in `~/.aws/config` and give the profile a name like `[profile internote]`. This config should contain the default `region` (eu-west-1) and the profile's `aws_access_key_id` and `aws_secret_access_key`.
- Install the AWS CDK CLI tools. These can be found [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html).
- Make a note of your AWS account ID. This can be found [here](https://console.aws.amazon.com/billing/home?#/account).
- Run the CDK bootstrapping using the AWS account ID you found in the step above. Ensure you use the same region you added to the credentials you used above. Should be `eu-west-1`. Steps for running this can be found [here](https://docs.aws.amazon.com/cdk/latest/guide/troubleshooting.html). It should be something like `cdk bootstrap aws://1234567890/eu-west-1 --profile=internote`.
- If this is successful you should see the project run what looks like a CDK synth, however it won't deploy. You should see something like `✅ Environment aws://1234567890/eu-west-1 bootstrapped.` returned from the console.

## CDK structure

The entire application is constructed of a CDK App which is made up (loosely) of one CDK Stack per service and with each CDK Stack containing CDK Constructs.

#### Naming conventions for identifiers

The Internote infrastructure follows an extension naming convention whereby identifiers are extended as such:

- The top-level CDK App defines the root identifier. This is how environments are supported, aka `internote-dev`
- Each CDK Stack assumes that a namespace has already been given aka `new InternoteSomethingStack(this,`\${id}-something`)`
- Within each CDK Stack, Constructs are extended similarly aka `new lambda.Function(this,`\${id}-awesome-lambda`)`
- Construct identifiers are suffixed with the type of Construct aka `-lambda`, `-bucket`
- Constructs that accept a "name" option, such as Lambda functions or S3 buckets take the identifier without the Construct suffix, aka `{ functionName:`\${id}-awesome`}`.

#### Custom CDK constructs

There are some custom CDK Constructs defined that provide sensible abstractions and defaults specific to Internote. These are available in the `infra` workspace under `constructs`.

#### Environment variables

Environment variables are used to plumb services together and are used as a mechanism for accessing resources at run-time, such as S3 buckets and DynamoDB tables. These variables are constructed at build-time using (mostly) CDK constructs and are exported / stored for later use.

**About process.env**

The view is taken that accessing `process.env` directly is dangerous as it isn't type-safe. For this purpose, type-safe abstractions around `process.env` have been written to ensure that services are not able to be run unless the correct environment is available.

**Lambdas**

Each lambda defines and exports a type for it's required environment (picked from the full environment type defined in the `infra` workspace). During the CDK synthesis, the necessary environment is prepared and passed in to the service at build time using the CDK Lambda construct. Note that only the minimum necessary environment is passed in to each lambda to keep the lambdas light-weight. The environment is validated at run-time and fails-fast if any required environment configuration is missing.

**AWS SSM**

AWS SSM is used to store environment variables and secrets that are used across the stack. During CDK synthesis of the back-end services, AWS SSM is populated with values corresponding to the created resources, for example `COGNITO_USER_POOL_ID`. These SSM values are used later by the front-end CDK synthesis to hydrate necessary environment configuration that connects the front-end to the back-end services.

Some services require environment variables that aren't created by CDK, for example the dictionary service requires API keys for the Oxford Dictionary API. These environment variables are configured and managed by AWS SSM directly and are imported in to the CDK definition of the service using AWS SSM imports.

# [OLD] serverless framework deployment

## Set up

Deployment is managed by the Serverless Framework deploying to AWS. To set up Serverless, follow the official documentation ensuring that Serverless is set up with the correct AWS credentials.

## Domains & SSL certificates

The domain names for deployment are managed manually through a combination of Route53, CloudFront and AWS Certificate Manager. To set the domain names up, head to the AWS console and do the following:

- Create a custom domain name in Route53
- Create a SSL certificate in AWS Certificate Manager. The certificate has to be in the `us-east-1` AWS region for it to work with CloudFront.
- Link up the SSL certificate with the domain name in API Gateway
- Grab the SSL certificate ARN from AWS Certificate Manager and enter it in to the cloudFront configuration in ui/serverless.yml
- Once deployed, link up the CloudFront distribution with the custom domain name in Route53 by ensuring there's an A record who's "Alias Target" points to the CloudFront "Domain Name"

## Stages

There are two stages set up for Internote (both front-end and back-end). The first is the `dev` stage that can be broken (if needed). The second is production that should be as stable as possible.

## Regions

By default, all AWS services are created in the `eu-west-1` (Ireland) region.

Some AWS services global are not tied to regions, such as AWS S3, AWS CloudFront, AWS Route53 etc.

There is a special mention for the front-end Next.js SSR Lambdas, which are deployed as Lambda@Edge functions. These are deployed in the `us-east-1` region for [reasons specified here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html). See the `ui/serverless.yml` for more information.

# Environment variables

There are multiple ways that environment variables are handled in Internote. There are no environment variables committed to source control.

## Non sensitive variables

Non-sensitive environment variables such as the "stage" (production or development), the AWS region etc are stored as environment variables in the Serverless framework configuration files in the codebase. These are committed to source control.

## Sensitive variables

Sensitive variables (such as private API keys) are stored in AWS Parameter Store and are referenced inside the Serverless framework configuration files in the codebase. These variables are not committed to source control.

**Important:** Since the Serverless framework does not have SSM permissions by default they need to be added to the Serverless user in IAM. See below for more info.

In general, secrets stored in SSM are prefixed with the "stage". For example `/internote/dev/OXFORD_API_ID` / `/internote/prod/OXFORD_API_ID`. These are then referenced in the relevant `serverless.yml` files using string substitution on the stage of the deployment.

## Front-end environment variables

#### In development

To support next's local development environment the [aws-env](https://github.com/Droplr/aws-env) executable is used to import and hydrate process.env from AWS SSM variables in-line before the development server has started. Similarly, when running a "built" version of the app, aws-env is used to hydrate the process.env before the server starts.

aws-env is configured to load _all_ variables prefixed with the "stage" for example `/internote/dev/*`.

#### In serverless (deployed)

Environment configuration is injected in to the serverless build scripts via AWS SSM using the AWS SDK for node. These environment variables are loaded in to the configuration at build time.

## Variable explanations

- **`OXFORD_API_ID`**: The Oxford Dictionary application ID used for looking up words. Can be in the Oxford Dictionary admin panel here
- **`OXFORD_API_KEY`**: The Oxford Dictionary application key used for looking up words. Can be in the Oxford Dictionary admin panel here
- **`COGNITO_USER_POOL_ID`**: The Cognito user pool ID for authentication. Can be found in the Cognito user pool settings here.
- **`COGNITO_USER_POOL_CLIENT_ID`**: The Cognito user pool client ID for authentication. Can be found in the Cognito user pool settings here (head to App client settings and look for "id").
- **`SERVICES_HOST`**: The domain name that the back-end services are deployed under. Can be found in the "domains" section here
- **`SERVICES_REGION`**: The AWS region that the back-end services are deployed in. This is eu-west-1.
- **`COGNITO_IDENTITY_POOL_ID`**: The Cognito identity pool ID for authentication. Can be found in the Cognito identity pool settings here.
- **`ATTACHMENTS_BUCKET_NAME`**: The name of the bucket where note attachments reside. Can be found here.
- **`SPEECH_BUCKET_NAME`**: The name of the bucket where generated speech files reside. Can be found here.

## Next.js environment variables set-up

In terms of Next.js, the environment variables are substituted at build-time using Next.js's `env` config option.

When running `yarn dev` locally, the environment variables are loaded using `aws-env` (you will have to `chmod +x aws-env` once it has installed).

When building in serverless, the environment variables are loaded using serverless SSM variables.

# CI / CD

Continuous integration & delivery is managed by seed.run and is set up to automatically deploy the application upon pushes to master.

## Automatic deployment

Since the application is running on seed.run's free tier, it's important to keep commits to master to a minimum in order to not run out of deployment minutes. For this reason, it's advised to open branches and pull requests, so that only merges are deployed.

## Seed.run IAM

There is a CloudFormation stack set up to manage IAM roles etc that seed.run needs, which was set up by seed.run when the project was set up. However, since Internote uses font-awesome, the npm token needs to be added as an environment variable to seed.run. Please see `seed.yml` and the official documentation for more info.

# Logs

## Serverless

Serverless dashboard is available: https://dashboard.serverless.com.

In order to set it up, run `serverless` in your terminal and run through the registration / login process and redeploy the services. After this, they will automatically appear in the serverless dashboard.

## CloudWatch

Logging is available in CloudWatch inside the AWS console.

## Dashbird

Logging and metrics are also available in Dashbird.

There is a CloudFormation stack set up to manage IAM roles etc that Dashbird needs. These were provisioned by Dashbird when the project was set up.

# Additional IAM permissions

The serverless policy needs the following additional IAM permissions to deploy the app:

- `s3:PutBucketAcl`
- `acm:ListCertificates`
- `apigateway:GET`
- `apigateway:DELETE`
- `apigateway:POST`
- `apigateway:POST`
- `cloudfront:UpdateDistribution`
- `route53:ListHostedZones`
- `route53:ChangeResourceRecordSets`
- `route53:GetHostedZone`
- `route53:ListResourceRecordSets`
- `iam:CreateServiceLinkedRole`
- `ssm:*`
- `logs:PutSubscriptionFilter`
- `route53:ListHostedZonesByName`
- `acm:RequestCertificate`
- `acm:DescribeCertificate`
- `iam:AttachRolePolicy`
- `dynamodb:DescribeContinuousBackups`
- `dynamodb:UpdateContinuousBackups`
