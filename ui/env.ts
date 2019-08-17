export interface Env {
  /**
   * Points to the S3 bucket (for deployed versions) that
   * hosts the static assets. The stuff stored in /static.
   *
   * In dev mode, this should be an empty string.
   * For deployed apps, this should be the S3 bucket's
   * root directory.
   */
  ASSET_PREFIX: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  /**
   * The hostname of the back-end services API gateway.
   * For example dev-services.internote.app
   */
  SERVICES_HOST: string;
  /**
   * The region that the back-end services are deployed in.
   * For example eu-west-1
   */
  SERVICES_REGION: string;
  COGNITO_IDENTITY_POOL_ID: string;
}

export const env: Env = {
  ASSET_PREFIX: process.env.ASSET_PREFIX,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  SERVICES_HOST: process.env.SERVICES_HOST,
  SERVICES_REGION: process.env.SERVICES_REGION,
  COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID
};
