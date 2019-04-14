# Internote UI

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
- AWS S3
- AWS Polly

## Environment

`dotenv` is used to inject environment variables in to the app at compile-time. `.env.development` is used for both localhost development and deployed dev environments and `.env` is used for deployed production environments.

- `API_BASE_URL` - points to the deployed Internote API base path.
- `ASSET_PREFIX` - points to generated assets from `next build`. In deployed environments, this points to the S3 bucket that the `.next/static` asset is synced with. See below for more information.

## Development

The development environment is a long-running next server in `dev` mode.

### Next

`yarn dev` will spin up a next server running on `http://localhost:3000`

### Serverless Offline

Unfortunately it is not possible (without significant effort) to get serverless-offline to work with Next in development mode. This is because next compiles pages on the fly and lambdas do not have access to write to the file system.

## Deployment

Internote UI is deployed to AWS Lambda via serverless using a suite of custom scripts and serverless plugins.

### Deployment dependencies

It's imperative that any dependencies added to the project (unless the dependency is used directly in the lambda files) are added as development dependencies. This is because the actual lambdas themselves have their dependencies inlined so there is no need to include `node_modules` along with the lambda. The plugin `serverless-webpack` automatically bundles any `package.json` `dependencies`, but _not_ `devDependencies`.

### Next lambdas

Next is placed in "serverless" mode which means that a single lambda function is created for each page. These lambdas are infrastructure-agnostic, meaning that we need to write custom lambdas specific for AWS that wrap around the generic Next lambdas.

### AWS Lambda

In order to get Next's lambdas working with AWS, wrapping lambdas are created for each page using a node script.

These are only temporary for the duration of the deploy script and get automatically cleaned up when the deploy process is finished.

### Static assets

Serving static files through AWS lambda isn't cost effective. As such, we copy next's output assets to S3 via a serverless plugin, and use next's `assetPrefix` option to point to the S3 bucket. The path to the `assetPrefix` is stored in a `.env` file.

In order to give serverless access to create public S3 buckets, the serverless policy needs to have the `"s3:PutBucketAcl"` permission (which it does not have by default).

> Next requests static files at the base path `http://my.app/_next` but does not output static assets in a `_next` directory. For this reason, we copy `.next/static` to a temporary directory `.static/_next` and sync the `.static` directory with S3 to ensure the correct paths in S3 (i.e. there will be a top level directory `_next` inside the S3 bucket). This is to avoid having to write a proxy to redirect static file requests to `_next` in the S3 bucket.
