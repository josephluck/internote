import * as cdk from "@aws-cdk/core";
import { InternoteGatewayStack } from "@internote/auth-service/cdk";
import { InternoteDictionaryStack } from "@internote/dictionary-service/cdk";
import { InternoteExportStack } from "@internote/export-service/cdk";
import { InternoteNotesStack } from "@internote/notes-service/cdk";
import { InternotePreferencesStack } from "@internote/preferences-service/cdk";
import { InternoteSnippetsStack } from "@internote/snippets-service/cdk";
import { InternoteSpeechStack } from "@internote/speech-service/cdk";

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

    authenticatedRole,
  } = new InternoteGatewayStack(app, id, props);

  const speechStack = new InternoteSpeechStack(app, `${id}-speech-service`, {
    ...props,
    api,

    authenticatedRole,
  });

  const preferencesStack = new InternotePreferencesStack(
    app,
    `${id}-preferences-service`,
    {
      ...props,
      api,

      authenticatedRole,
    }
  );

  const notesStack = new InternoteNotesStack(app, `${id}-notes-service`, {
    ...props,
    api,

    authenticatedRole,
  });

  const snippetsStack = new InternoteSnippetsStack(
    app,
    `${id}-snippets-service`,
    {
      ...props,
      api,

      authenticatedRole,
    }
  );

  const dictionaryStack = new InternoteDictionaryStack(
    app,
    `${id}-dictionary-service`,
    {
      ...props,
      api,

      authenticatedRole,
    }
  );

  const exportStack = new InternoteExportStack(app, `${id}-export-service`, {
    ...props,
    api,

    authenticatedRole,
  });

  console.log({
    speechStack: speechStack.toString(),
    preferencesStack: preferencesStack.toString(),
    notesStack: notesStack.toString(),
    snippetsStack: snippetsStack.toString(),
    dictionaryStack: dictionaryStack.toString(),
    exportStack: exportStack.toString(),
  });

  // app.synth();
};

build();
