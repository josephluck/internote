# Internote UI

## Stack

- TypeScript
- React
- Next
- Twine

## Deployment

- Serverless
- AWS Lambda
- AWS Api Gateway
- AWS S3

## Environment

`dotenv` is used to inject environment variables in to the app at compile-time. `.env.development` is used for development and `.env` is used for production.

- `API_BASE_URL` - points to the deployed API base path.
- `ASSET_PREFIX` - points to generated assets from `next build`. In deployed environments, this points to the S3 bucket that the `.next/static` asset is synced with.

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

### Static assets

Serving static files through AWS lambda isn't cost effective. As such, we copy next's output assets to S3 via a serverless plugin, and use next's `assetPrefix` option to point to the S3 bucket.

> Next requests static files at the base path `http://my.app/_next` but does not output static assets in a `_next` directory. For this reason, we copy `.next/static` to a temporary directory `.static/_next` and sync the `.static` directory with S3 to ensure the correct paths in S3. This is to avoid having to write a proxy to redirect file requests to `_next` in the S3 bucket.

In order to get this to work, the default serverless policy needs to have the `"s3:PutBucketAcl"` permission (which it does not have by default)
