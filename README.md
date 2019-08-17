# Internote

Beautiful web-based note editor with a focus on distraction-free content creation.

**[Get started!](https://internote.app)**

## Features

**Rich editor**

All the standard formatting options you'd expect from a modern editor.

**Offline sync**

Don't worry about dropping off the WiFi or accidentally closing Internote, notes are saved offline and synced periodically to the server in the background, even when Internote is closed.

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

**Markdown shortcuts**

Familiar with markdown? Use markdown shortcuts like `## Heading two` and `> Block quote` and `- List item` for quick formatting.

**Auto save**

No need to press save. Notes and settings are automatically saved to the cloud. Log in on many devices using the same account.

**Conflict detection**

No messy overwrites, Internote will let you know if you're about to overwrite your note.

**Password-less login**

Always forget your password? Just enter your e-mail and receive a one-time-passcode to sign up or sign in.

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
- Service workers

#### Back-end

- Typescript
- Koa
- PostgreSQL
- TypeORM
- A variety of AWS services
- Oxford dictionary API

#### Ops / architecture

- Serverless (AWS)
- Lambda
- API Gateway
- CloudWatch
- Route 53
- S3
- Dashbird

## Deployment

- Create an AWS account
- Follow [these](https://serverless.com/framework/docs/providers/aws/guide/installation/) and [these](https://serverless.com/framework/docs/providers/aws/guide/credentials/) instructions
- Use the `serverless config credentials --provider aws --key EXAMPLE --secret EXAMPLEKEY` method of authenticating serverless with AWS
- Follow instructions in each package in this repo for individual service deployment

#### Domains & SSL certificates

The domain names for deployment are managed manually through Route53 and AWS Certificate Manager.

- Create a custom domain name in Route53
- Create a SSL certificate in AWS Certificate Manager
- Link up the SSL certificate with the domain name in [API Gateway](https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/custom-domain-names)
- Grab the SSL certificate ARN from AWS Certificate Manager and enter it in to the `cloudFront` configuration in `ui/serverless.yml`

## Logs

#### CloudWatch

Logging is available in CloudWatch.

> Follow [these instructions](https://serverless-stack.com/chapters/api-gateway-and-lambda-logs.html#enable-api-gateway-cloudwatch-logs) to enable API Gateway logs in CloudWatch.

#### Dashbird

Logging and metrics are also available in Dashbird.

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
