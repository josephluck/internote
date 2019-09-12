import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

// See readme for more info on what these are and what they mean
export interface Env {
  ATTACHMENTS_BUCKET_NAME: string;
  COGNITO_IDENTITY_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  SERVICES_HOST: string;
  SERVICES_REGION: string;
  SPEECH_BUCKET_NAME: string;
}

export const env: Env = {
  ATTACHMENTS_BUCKET_NAME: publicRuntimeConfig.ATTACHMENTS_BUCKET_NAME,
  COGNITO_IDENTITY_POOL_ID: publicRuntimeConfig.COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: publicRuntimeConfig.COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID: publicRuntimeConfig.COGNITO_USER_POOL_ID,
  SERVICES_HOST: publicRuntimeConfig.SERVICES_HOST,
  SERVICES_REGION: publicRuntimeConfig.SERVICES_REGION,
  SPEECH_BUCKET_NAME: publicRuntimeConfig.SPEECH_BUCKET_NAME
};
