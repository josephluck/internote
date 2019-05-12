# Internote

Beautiful web-based editor with a focus on distraction-free content creation.

**[Internote](https://internote.app)**

## Features

**Rich editor**

All the standard formatting options you'd expect from a modern editor.

**Focus mode**

Go full zen by entering focus mode. All distracting user interface disappears and the current section highlighted so you can focus on writing completely distraction-free.

**Themes**

Multiple colour and typography themes. Serif's your jam? What about dark mode? No problems.

**Dictionary**

Can't find the perfect word or want to check that your use of a word is correct? Just highlight a word and you're a single click away to the full power of Oxford's full dictionary and thesauras.

**Speech**

Text to speech - just highlight a sentence or paragraph and press the speech button to hear it. Choose from multiple voices, male or female.

**Fullscreen mode**

Go completely distraction free by entering fullscreen mode.

**Keyboard shortcuts**

Rich keyboard shortcuts system for power use.

**Auto save in the cloud**

No need to press save. Notes and settings are automatically saved to the cloud. Log in on many devices using the same account.

**More**

Many more features are [planned](https://github.com/josephluck/internote/issues) and if you feel like lending a hand, feel free to contribute to any of the open issues.

Feel free to request new features too, but please bear in mind that this is a personal side project with a very specific purpose, so I might not agree with and/or build everything!

## Application stack

#### Front-end

- TypeScript
- React
- Next
- Twine
- Styled components

#### Back-end

- Typescript
- Koa
- PostgreSQL
- TypeORM
- AWS Polly
- Oxford dictionary API

#### Dev-ops

- Serverless (AWS)
- AWS Lambda
- AWS API Gateway
- AWS CloudWatch
- AWS Route 53
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
