export interface Env {
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
  /** The name of the attachments bucket */
  ATTACHMENTS_BUCKET_NAME: string;
}

export const env: Env = {
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  SERVICES_HOST: process.env.SERVICES_HOST,
  SERVICES_REGION: process.env.SERVICES_REGION,
  COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
  ATTACHMENTS_BUCKET_NAME: process.env.ATTACHMENTS_BUCKET_NAME
};
