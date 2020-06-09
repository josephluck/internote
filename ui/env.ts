// NB: See readme for more info on what these are and what they mean
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
  ATTACHMENTS_BUCKET_NAME: process.env.ATTACHMENTS_BUCKET_NAME,
  COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  SERVICES_HOST: process.env.SERVICES_HOST,
  SERVICES_REGION: process.env.SERVICES_REGION,
  SPEECH_BUCKET_NAME: process.env.SPEECH_BUCKET_NAME,
};
