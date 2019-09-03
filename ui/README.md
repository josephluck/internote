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

`dotenv` is used to inject environment variables in to the app at compile-time. `.env.development` is used for deployed dev environments, `.env.local` is used for localhost environments and `.env` is used for deployed production environments.

See `env.ts` for descriptions of what each environment variable is for.

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
