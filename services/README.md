# Internote services

Internote services power the back-end for Internote.

## Architecture

There are several independent microservices, each responsible for a portion of the overall back-end. Each service is deployed using the Serverless framework and there's a shared library of utilities that are used in multiple services.

The Internote services are organised using a yarn workspaces monorepository, though maintain autonomy and isolation from one another in terms of deployment and resources.

#### Auth

Authentication in Internote is powered by AWS Cognito and follows a passwordless experience whereby the user does not set their own password, but instead, receives a one-time passcode for signing up or signing in via email (SES is used for e-mail sending).

The authentication credentials are used to sign requests to other services using AWS Signing Key Signatures. These include requests to API Gateway or S3 for example using a Cognito Federated Identity. Other services are authorized using API Gateway's IAM authorization (this means that authorization is handled prior to lambdas that require authorization being invoked).

The auth service sets up a Cognito User Pool, Cognito Identity Pool, Cognito User Pool Client and the associated IAM roles and permissions to link them together.

#### Health

The health service is the "master" service which means it sets up the API Gateway (and exposes it) to the other services.

The health services also exposes two endpoints. One that does not require authentication and one that does for the purpose of testing the Serverless set up.

#### Attachments

The attachments service is responsible for facilitating client uploads to an S3 bucket for storing inside notes. For example, images and videos.

It is important that the client uploads these attachments directly to the S3 bucket, since it's discouraged to supply an endpoint to facilitate the same.

#### Notes

The notes service is responsible for the creation, deletion, listing and management of notes in the Internote app.

#### Preferences

The preferences service is responsible for the creation, management and retrieval of user settings such as colour scheme, focus mode etc.

## APIs, DTOs and validation

Each Internote service defines it's own types for request and response DTOs. These types are consumed by client applications to construct strongly-typed SDKs on top of the services.

Each Internote service defines request body validation using API Gateway Request Body Validations using the Serverless framework as per [this guide](https://serverless.com/blog/framework-release-v142).

## Database

The Internote services use DynamoDB for data persistence. Each service is responsible for defining it's own DynamoDB schema and management.

The Internote services uses Type Dynamo as an ORM on top of DynamoDB. Since DynamoDB is schemaless, attributes that are added to a model _after initial set up and deployment_ are defined as optional attributes and are enforced as such using strict TypeScript compiler options.

## Domains

There are two domains available for Internote services:

- https://dev-services.internote.app
- https://services.internote.app

Each service is responsible for defining it's routing via it's `serverless.yml` definition. Deployment of the API gateway and domain name is done in the `services/health/serverless.yml`[/services/health/serverless.yml] service via `serverless-domain-manager`.

#### API Gateway

An API Gateway is created by the Serverless framework to route traffic from the internet through to the lambdas that power the Internote services. Each service references this API Gateway in it's Serverless set up as to use the same API Gateway.

Since the Internote services are designed to be called by a 3rd party client application (such as the front-end that powers the Internote editor), CORS is enabled for every lambda that the front-end hits directly.

#### SSL

SSL certificates are managed by AWS Certificate Manager where a sub-domain wildcard SSL certificate is linked with the API gateway that powers Internote services.

#### Set up

Since Route53 is not covered by the Serverless framework, the domain and SSL set up is managed manually through Route53 and AWS Certificate Manager using the AWS console.

## Email

The Internote services send emails to users. Amazon SES is set up and configured for this purpose and is set up loosely according to [these](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-getting-started-before.html) guidelines.

> Note that SES is set up manually outside of the Serverless framework using the AWS console.

The Internote service's lambdas are set up to send from "no-reply@internote.app"

#### Receiving email

Although Internote does not support replies on emails sent to users, an S3 bucket is set up to receive e-mails.

## Environment variables

There are multiple ways that environment varaibles are injected in to the Internote services.

#### Non sensitive variables

Non-sensitive environment variables such as the "stage" (production or development), the AWS region etc are stored as environment variables in the Serverless framework configuration files in the codebase. These are commited to source control.

#### Sensitive variables

Sensitive variables (such as private API keys) are stored in AWS Parameter Store and are referenced inside the Serverless framework configuration files in the codebase. These variables are not commited to source control.
