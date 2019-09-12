# Internote UI

- [Production application](https://internote.app)
- [Development application](https://dev.internote.app)
- [Production storybook](http://internote-prod-storybook.s3-website-eu-west-1.amazonaws.com/)
- [Development storybook](http://internote-dev-storybook.s3-website-eu-west-1.amazonaws.com/)

## Stack

- TypeScript
- React
- Next
- Twine
- Slate

## Deployment

- Serverless
- AWS Lambda
- AWS Api Gateway
- AWS Route 53
- AWS S3

## Environment

Environment varaibles are stored [in AWS SSM](https://eu-west-1.console.aws.amazon.com/systems-manager/parameters/?region=eu-west-1). Please see the top-level [README.md](../README.md) for more information.

In terms of Next.js, the environment varaibles are substituted at build-time using Next.js's `env` [config option](https://github.com/zeit/next.js/#build-time-configuration).

When running `yarn dev` locally, the environment variables are loaded using [`aws-env`](https://github.com/Droplr/aws-env#usage) (you will have to `chmod +x aws-env` once it has installed).

When building in serverless, the environment variables are loaded using [serverless SSM variables](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store).

## Development

The development environment is a long-running next server in `dev` mode. This differs from a deployed application where next is placed in lambda / serverless mode.

### Next

`yarn dev` will spin up a next server running on `http://localhost:3000`

### Serverless Offline

Unfortunately it is not possible (without significant effort) to get serverless-offline to work with Next in development mode. This is because next compiles pages on the fly and lambdas do not have access to write to the file system.

## Deployment

Internote UI is deployed to AWS Lambda via serverless using serverless-next-plugin.

### Deployment dependencies

It's imperative that any dependencies added to the project (unless the dependency is used directly in the lambda files) are added as development dependencies. This is because the actual lambdas themselves have their dependencies inlined so there is no need to include `node_modules` along with the lambda. The plugin `serverless-webpack` automatically bundles any `package.json` `dependencies`, but _not_ `devDependencies`.
