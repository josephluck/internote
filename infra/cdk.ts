import * as cdk from "@aws-cdk/core";
import { InternoteGatewayStack } from "@internote/auth-service/cdk";
import { InternoteNotesStack } from "@internote/notes-service/cdk";
import { InternotePreferencesStack } from "@internote/preferences-service/cdk";
import { InternoteSpeechStack } from "@internote/speech-service/cdk";

// import { InternoteApiGatewayStack } from "./api-gateway";
import { buildServices } from "./build-services";

export const build = async () => {
  try {
    await buildServices();
  } catch (err) {
    console.log(err);
    throw err;
  }

  const id = `internote-cdk-experiment`; // TODO: stage?
  const props = {};
  const app = new cdk.App();

  const {
    api,
    cognitoAuthorizer,
    authenticatedRole,
  } = new InternoteGatewayStack(app, id, props);

  const speechStack = new InternoteSpeechStack(app, `${id}-speech-service`, {
    ...props,
    api,
    cognitoAuthorizer,
    authenticatedRole,
  });

  const preferencesStack = new InternotePreferencesStack(
    app,
    `${id}-preferences-service`,
    {
      ...props,
      api,
      cognitoAuthorizer,
      authenticatedRole,
    }
  );

  const notesStack = new InternoteNotesStack(app, `${id}-notes-service`, {
    ...props,
    api,
    cognitoAuthorizer,
    authenticatedRole,
  });

  console.log({
    speechStack: speechStack.toString(),
    preferencesStack: preferencesStack.toString(),
    notesStack: notesStack.toString(),
  });

  // app.synth();
};

build();
