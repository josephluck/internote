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
  <pre><a href="https://internote.app">https://internote.app</a></pre>
  <br />
  <br />
  <br />
  <br />
</div>

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

**Media attachments**

Embed images, videos, audios and attach any other files to your notes. Your files are stored securely, only you can access them.

**Dictionary**

Can't find the perfect word or want to check that your use of a word is correct? Just highlight a word and you're a single click away to the full power of Oxford's English dictionary and thesaurus.

**Speech**

Just highlight a sentence or paragraph and press the speech button to hear it. Choose from multiple voices, male or female.

**Snippets**

Create snippets of content that can be saved and reused whenever needed.

**Export**

Need to take your notes elsewhere? Export as markdown, or as HTML.

**Code editor**

Integrated code editor based on Visual Studio Code's Monaco editor. Embed multiple code editors in a single document. Full syntax highlighting, IntelliSense, you name it.

**Full-screen mode**

Go completely distraction free by entering full-screen mode.

**Keyboard shortcuts**

Rich keyboard shortcuts system for power use.

**Markdown shortcuts**

Familiar with markdown? Use markdown shortcuts like `## Heading two` and `> Block quote` and `- List item` for quick formatting.

**Auto save**

No need to press save. Notes and settings are automatically saved to the cloud. Log in on many devices using the same account.

**Offline sync**

Don't worry about dropping off the WiFi or accidentally closing Internote, notes are saved offline and synced periodically to the server in the background, even when Internote is closed.

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
- Create a SSL certificate in AWS Certificate Manager. The certificate has to be in the _es-east-1_ AWS region for it to work with CloudFront.
- Link up the SSL certificate with the domain name in [API Gateway](https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/custom-domain-names)
- Grab the SSL certificate ARN from AWS Certificate Manager and enter it in to the `cloudFront` configuration in `ui/serverless.yml`
- Once deployed, link up the CloudFront distribution with the custom domain name in Route53 by ensuring there's an A record who's "Alias Target" points to the CloudFront "Domain Name"

## Environment variables

There are multiple ways that environment varaibles are injected in to the Internote services.

#### Non sensitive variables

Non-sensitive environment variables such as the "stage" (production or development), the AWS region etc are stored as environment variables in the Serverless framework configuration files in the codebase. These are commited to source control.

#### Sensitive variables

Sensitive variables (such as private API keys) are stored in [AWS Parameter Store](https://eu-west-1.console.aws.amazon.com/systems-manager/parameters/?region=eu-west-1) and are referenced inside the Serverless framework configuration files in the codebase. These variables are not commited to source control.

**Important** - Since the Serverless framework does not have SSM permissions in IAM by default, they need to be added. [More reading](https://github.com/serverless/serverless/issues/5781). See below for more info.

In general, secrets stored in SSM are prefixed with the "stage". For example `/internote/dev/OXFORD_API_ID` / `/internote/prod/OXFORD_API_ID`. These are then referenced in the relevant `serverless.yml` files using string substitution on the `stage` of the deployment.

#### Variable explanations

- `OXFORD_API_ID`: The Oxford Dictionary application ID used for looking up words. Can be in the Oxford Dictionary admin panel [here](https://developer.oxforddictionaries.com/)
- `OXFORD_API_KEY`: The Oxford Dictionary application key used for looking up words. Can be in the Oxford Dictionary admin panel [here](https://developer.oxforddictionaries.com/)
- `COGNITO_USER_POOL_ID`: The Cognito user pool ID for authentication. Can be found in the Cognito user pool settings [here](https://eu-west-1.console.aws.amazon.com/cognito).
- `COGNITO_USER_POOL_CLIENT_ID`: The Cognito user pool client ID for authentication. Can be found in the Cognito user pool settings [here](https://eu-west-1.console.aws.amazon.com/cognito) (head to App client settings and look for "id").
- `SERVICES_HOST`: The domain name that the back-end services are deployed under. Can be found in the "domains" section [here](services/health/serverless.yml)
- `SERVICES_REGION`: The AWS region that the app is deployed in. This is eu`-west-1`.
- `COGNITO_IDENTITY_POOL_ID`: The Cognito identity pool ID for authentication. Can be found in the Cognito identity pool settings [here](https://eu-west-1.console.aws.amazon.com/cognito).
- `ATTACHMENTS_BUCKET_NAME`: The name of the bucket where note attachments reside. Can be found [here](services/attachments/serverless.yml).
- `SPEECH_BUCKET_NAME`: The name of the bucket where generated speech files reside. Can be found [here](services/speech/serverless.yml).

## CI / CD

Continuous integration & delivery is managed by [seed.run](https://seed.run/).

There is a CloudFormation stack set up to manage iAM roles etc that seed.run needs.

The dashboards are available [here](https://console.seed.run/josephluck/internote).

There are some specific things for Internote that need to be done to get the CI/CD workflow working.

- Add the font awesome NPM token from `~/.npmrc` to [seed environment variables](https://seed.run/docs/storing-secrets). This will pick up the token for authentication during the installation phase.

## Logs

#### CloudWatch

Logging is available in CloudWatch.

> Follow [these instructions](https://serverless-stack.com/chapters/api-gateway-and-lambda-logs.html#enable-api-gateway-cloudwatch-logs) to enable API Gateway logs in CloudWatch.

#### Dashbird

Logging and metrics are also available in Dashbird.

There is a CloudFormation stack set up to manage iAM roles etc that Dashbird needs.

> Follow [these instructions](https://dashbird.io/docs/get-started/quick-start/) to enable Dashbird

## Additional serverless AWS permissions

The serverless policy needs the following additional permissions to deploy the app:

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
- "ssm:\*"
