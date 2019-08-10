# Internote

Beautiful web-based note editor with a focus on distraction-free content creation.

**[Get started!](https://internote.app)**

## Features

**Rich editor**

All the standard formatting options you'd expect from a modern editor.

**Beautiful design**

Internote has been designed with simplicity and beauty in mind for effortless note taking.

**Focus mode**

Go full zen by entering focus mode. All distracting user interface disappears and the current section highlighted so you can focus on writing completely distraction-free.

**Outline**

See the overview of your document and quickly navigate to headings and subheadings using a handy outline view.

**Themes**

Multiple colour and typography themes. Serif's your jam? What about dark mode? No problems.

**Emojis**

Emoji support because Internote is down with the kids :tada:

**Tags**

Tag notes using a simple #tag system. Easily search for notes by tag.

**Dictionary**

Can't find the perfect word or want to check that your use of a word is correct? Just highlight a word and you're a single click away to the full power of Oxford's English Dictionary and thesaurus.

**Speech**

Just highlight a sentence or paragraph and press the speech button to hear it. Choose from multiple voices, male or female.

**Full-screen mode**

Go completely distraction free by entering full-screen mode.

**Keyboard shortcuts**

Rich keyboard shortcuts system for power use.

**Auto save**

No need to press save. Notes and settings are automatically saved to the cloud. Log in on many devices using the same account.

**Conflict detection**

No messy overwrites, Internote will let you know if you're about to overwrite your note.

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
- Slate

#### Back-end

- Typescript
- Koa
- PostgreSQL
- TypeORM
- A variety of amazon web services
- Oxford dictionary API

#### Dev-ops

- Serverless (AWS)
- AWS Lambda
- AWS API Gateway
- AWS CloudWatch
- AWS Route 53
- AWS S3

## Deployment

- Create an AWS account
- Follow [these](https://serverless.com/framework/docs/providers/aws/guide/installation/) and [these](https://serverless.com/framework/docs/providers/aws/guide/credentials/) instructions
- Use the `serverless config credentials --provider aws --key EXAMPLE --secret EXAMPLEKEY` method of authenticating serverless with AWS
- Update the serverless policy you created to include the `"s3:PutBucketAcl"` permission
- Create `.env` files in both `ui` and `api` and fill them out with production configuration
- Run `yarn deploy:prod` from the root of this project

## Logs

#### CloudWatch

Logging is available in CloudWatch.

> Follow [these instructions](https://serverless-stack.com/chapters/api-gateway-and-lambda-logs.html#enable-api-gateway-cloudwatch-logs) to enable API Gateway logs in CloudWatch.

#### Dashbird

Logging and metrics are available in Dashbird

> Follow [these instructions](https://dashbird.io/docs/get-started/quick-start/) to enable Dashbird

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
