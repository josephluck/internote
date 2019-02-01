# Internote

A simple note taking application.

## Stack

- TypeScript
- React
- Next
- Twine
- Styled components
- Koa
- Postgresql
- Typeorm

## Deployment

- Serverless
- AWS Lambda

## Local development environment

To run long-running servers locally:

- Install node & yarn
- Create a cloud instance of postgres (ElephantSQL is pretty good)
- Copy `/api/.env.reference` to `/api/.env.development` and fill it out (ensuring you copy the right things from the postgres cloud instance)
- Do the same for `/ui/.env.reference`
- Run `yarn dev`
- Visit `http://localhost:3000`

> The UI application runs on http://localhost:3000 and the API runs on port http://localhost:2020

> If you're deploying the production application, you'll need to create `.env` files before deployment

## Serverless development environment

It's possible to emulate the serverless stack locally by doing the following:

- Set up the deployment set up instructions below
- TODO

## Deployment set up

- Create an AWS account
- Follow [these](https://serverless.com/framework/docs/providers/aws/guide/installation/) and then [these](https://serverless.com/framework/docs/providers/aws/guide/credentials/) instructions
- Use the `serverless config credentials --provider aws --key EXAMPLE --secret EXAMPLEKEY` method of authenticating serverless with AWS

## Deployment

Simply run `yarn serverless:deploy` from the root of this repository to deploy to production
