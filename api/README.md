# Internote API

## Stack

- Typescript
- Koa
- TypeORM
- Postgres
- AWS Polly
- Axios
- Oxford dictionary API
- JWT token authentication

## Deployment

- Serverless
- AWS Lambda
- AWS Api Gateway
- AWS S3
- AWS Route 53

## Environment

`.env.development` is used when running the app locally, and when deployed to the dev environment. `.env` is used when deploying to production.

- `DB_HOST` - host name for remote database instance
- `DB_PORT` - port for remote database instance
- `DB_USERNAME` - username for remote database instance
- `DB_PASSWORD` - password for remote database instance
- `DB_DATABASE` - database name for remote database instance
- `JWT_SECRET` - secret used to encode JWT tokens for authentication
- `JWT_SECRET` - secret used to encode JWT tokens for authentication
- `API_PORT` - port that the server runs on
- `OXFORD_API_ID` - oxford dictionary API id used for dictionary lookups API
- `OXFORD_API_KEY` - oxford dictionary API key used for dictionary lookups API

## Deployment

Internote API is deployed to AWS Lambda via serverless using a suite of custom scripts and serverless plugins. Currently as a single lambda function, but eventually will be split in to several separate lambda functions (one per domain).
