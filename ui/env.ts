export interface Env {
  LOCALHOST: "true" | "false";
  API_BASE_URL: string;
  ASSET_PREFIX: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_REGION: string;
}

export const env: Env = {
  LOCALHOST: process.env.LOCALHOST,
  API_BASE_URL: process.env.API_BASE_URL,
  ASSET_PREFIX: process.env.ASSET_PREFIX,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_REGION: process.env.COGNITO_REGION
};
