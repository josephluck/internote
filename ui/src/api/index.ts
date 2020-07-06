import { makeAuthApi } from "../auth/api";
import { env } from "../env";
import { makeApi } from "./api";
import { makeAttachmentsApi } from "./attachments";

const restApi = makeApi({
  host: env.REACT_APP_SERVICES_HOST as string,
  region: env.REACT_APP_SERVICES_REGION as string,
});

const authApi = makeAuthApi({
  region: env.REACT_APP_SERVICES_REGION as string,
  userPoolId: env.REACT_APP_COGNITO_USER_POOL_ID as string,
  userPoolClientId: env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID as string,
  identityPoolId: env.REACT_APP_COGNITO_IDENTITY_POOL_ID as string,
});

const attachmentsApi = makeAttachmentsApi({
  region: env.REACT_APP_SERVICES_REGION || "",
  bucketName: env.REACT_APP_SPEECH_BUCKET_NAME || "",
});

export const api = {
  ...restApi,
  auth: authApi,
  attachments: attachmentsApi,
};
