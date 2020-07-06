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

## Stages

There are several "stages" set up, where each stage is an entire full stack deployment of Internote.

#### Adding a new stage

Add the stage name to the type `Stage` in `infra/env`, then add it as a stack output to `infra/cdk`.

You'll then need to add environment configuration to SSM for environment variables that are _not_ generated via AWS CDK during deployment. See `infra/env` for the list. Note that SSM keys are populated using the convention `internote/[stage]/[key]` where `[stage]` is the stage of the deployment (i.e. `dev`) and `[key]` is the name of the key of the variable (i.e. `OXFORD_API_KEY`).

## Deploying

Deployment of the entire stack is managed via the `infra` workspace. There are three parts that must be run in this order:

- `yarn build --stage=[stage]`: Transpiles services code from TypeScript to JavaScript ready for deployment.
- `cdk --profile=internote synth internote-[stage]`: Synthesises the CDK stack to CloudFormation ready for deployment. Replace `[stage]` with the stage you wish to synthesise.
- `cdk --profile=internote deploy internote-[stage]`: Deploys the CDK stack to AWS using the synthesised CloudFormation template.

#### Example

```bash
yarn build
cdk synth internote-dev
cdk deploy internote-dev
```

#### Removing services

To decommission a stage, you can run `cdk destroy internote-[stage]` where `[stage]` is the name of the stage to remove.

> 🚨 Be really careful when doing this. Some of the constructs in this repository have dangerous removal policies (user pools for example). Double check what you're deleting before you run this!

## CDK structure

The entire application is constructed of a CDK App which is made up (loosely) of one CDK Stack per service and with each CDK Stack containing CDK Constructs.

#### Naming conventions for identifiers

The Internote infrastructure identifiers follows a naming convention whereby identifiers are extended as such:

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

The front-end requires some environment configuration. To facilitate this, some CDK generated environment variables are exported as "public" which results in two SSM key values, one for the original key and another prefixed with `REACT_APP_`.

**Front end**

The front-end hydrates the `process.env` by pulling from both AWS SSM and from local config files time using aws-sdk in a custom node script.

# Logging

CloudWatch is enabled for the API Gateway and all Lambdas.
