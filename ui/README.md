# Internote UI

## Stack

- TypeScript
- React
- Next
- Twine

## Environment

`dotenv` is used to inject environment variables in to the app at compile-time. `.env.development` is used for development and `.env` is used for production.

## Development

The development environment is a long-running next server in `dev` mode.

### Next

`yarn dev` will spin up a next server running on `http://localhost:3000`

### Serverless Offline

Unfortunately it is not possible (without significant effort) to get serverless-offline to work with Next in development mode. This is because next compiles pages on the fly and lambdas do not have access to write to the file system.

## Deployment

Internote UI is deployed to AWS Lambda via serverless.

### Dependencies

It's imperative that any dependencies added to the project (unless the dependency is used in the lambda files) are added as development dependencies.

### Next

Next is placed in "serverless" mode which means that a single lambda function is created for each page. These lambdas

### AWS Lambda

In order to get Next's lambdas working with AWS, wrapping lambdas are created for each page in the `lambdas` directory.

In the future it would be good to automatically generate these.
