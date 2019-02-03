# Internote UI

## Stack

- TypeScript
- React
- Next
- Twine

## Environment

`dotenv` is used to inject environment variables in to the app at compile-time. `.env.development` is used for development and `.env` is used for production.

## Development

During development, two servers run. This is not "strictly" serverless since all we do is proxy the serverless requests to the next server inside `lambda.ts`.

### Next

The next development server listens on `http://localhost:3001`. This is a standard next server and can be used as-such.

### Serverless

The `serverless-offline` server listens on `http://localhost:3000` and acts as a local lambda.

We shim the serverless lambda to proxy requests to the next server running on `http://localhost:3001`. This is because next's development server compiles files on the fly, and lambdas do not have access to write to the file system.

## Deployment

Internote UI is deployed to AWS Lambda via serverless.

### Server

`server.ts` is an express server that proxies the next server.

### Lambda

The lambda is written in TypeScript which in-turn imports the server. Using `serverless-webpack` and `ts-loader` ensures that the lambda and server are transpiled in to JavaScript for the lambda to run.

### Packaging

When a deploy is started, `next build` is run to create a production version of the next app transpiled and ready to serve. Then, `serverless-webpack` and `copy-webpack-plugin` are used by `serverless` to copy the generated `.next` directory in to the lambda as these will not be there by default.

`serverless-webpack` also scans the lambda and copies `node_module` dependencies it finds, however it does not scan the `.next` directory. For this reason, we have to explicitly list the dependencies our app uses in `serverless.yml`. This forces `serverless-webpack` to include them.
