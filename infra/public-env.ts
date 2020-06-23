export interface Env {
  COGNITO_IDENTITY_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  // NB: cannot include 'https://' _or_ anything past the TLD. I.e. should be something like r89h20hjasioj.execute-api.eu-west-1.amazonaws.com
  SERVICES_HOST: string;
  SERVICES_REGION: string;
  STAGE: "prod" | "staging" | "dev";
}

export const env: Env = {
  COGNITO_IDENTITY_POOL_ID: "COGNITO_IDENTITY_POOL_ID",
  COGNITO_USER_POOL_CLIENT_ID: "COGNITO_USER_POOL_CLIENT_ID",
  COGNITO_USER_POOL_ID: "COGNITO_USER_POOL_ID",
  SERVICES_HOST: "rujy4qd8g9.execute-api.eu-west-1.amazonaws.com",
  SERVICES_REGION: "eu-west-1",
  STAGE: "prod"
};
