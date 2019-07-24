export interface Env {
  LOCALHOST: "true" | "false";
  API_BASE_URL: string;
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
  LOCALHOST: process.env.LOCALHOST as "true" | "false",
  API_BASE_URL: process.env.API_BASE_URL,
  ASSET_PREFIX: process.env.ASSET_PREFIX,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  SERVICES_REGION: process.env.SERVICES_REGION,
  COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID
};
