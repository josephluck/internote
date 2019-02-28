# Internote

A simple note taking application.

## Application stack

#### Front-end

- TypeScript
- React
- Next
- Twine
- Styled components

#### Back-end

- Koa
- PostgreSQL
- Typeorm

#### Dev-ops

- Serverless
- AWS Lambda
- AWS API Gateway
- AWS S3

## Local development environment

Internote runs on a serverless stack, and is set up with serverless-offline for localhost development.

- Install node & yarn
- Run `yarn` to install dependencies
- Create a cloud instance of postgres (ElephantSQL is pretty good)
- Copy `/api/.env.reference` to `/api/.env.development` and fill it out (ensuring you copy the right things from the PostgreSQL instance)
- Do the same for `/ui/.env.reference`
- Run `yarn dev` from the root of the project
- Visit `http://localhost:3000`

> The UI application runs on http://localhost:3000 and the API runs on port http://localhost:2020

## Deployment

- Create an AWS account
- Follow [these](https://serverless.com/framework/docs/providers/aws/guide/installation/) and [these](https://serverless.com/framework/docs/providers/aws/guide/credentials/) instructions
- Use the `serverless config credentials --provider aws --key EXAMPLE --secret EXAMPLEKEY` method of authenticating serverless with AWS
- Update the serverless policy you created to include the `"s3:PutBucketAcl"` permission
- Create `.env` files in both `ui` and `api` and fill them out with production configuration
- Run `yarn deploy` from the root of this project

## Logs

Logging is available in CloudWatch.

> Follow [these instructions](https://serverless-stack.com/chapters/api-gateway-and-lambda-logs.html#enable-api-gateway-cloudwatch-logs) to enable API Gateway logs in CloudWatch.

## Additional serverless AWS permissions

The serverless policy needs the following additional permissions to deploy the app:

> These should eventually be put in to serverless.yml, rather than manually managed

- "s3:PutBucketAcl",
- "acm:ListCertificates",
- "apigateway:GET",
- "apigateway:DELETE",
- "apigateway:POST",
- "apigateway:POST",
- "cloudfront:UpdateDistribution",
- "route53:ListHostedZones",
- "route53:ChangeResourceRecordSets",
- "route53:GetHostedZone",
- "route53:ListResourceRecordSets",
- "iam:CreateServiceLinkedRole"
