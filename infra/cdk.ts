import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
import { InternoteDictionaryStack } from "@internote/dictionary-service/cdk";
import { InternoteExportStack } from "@internote/export-service/cdk";
import { InternoteGatewayStack } from "@internote/gateway-service/cdk";
import { InternoteNotesStack } from "@internote/notes-service/cdk";
import { InternotePreferencesStack } from "@internote/preferences-service/cdk";
import { InternoteSnippetsStack } from "@internote/snippets-service/cdk";
import { InternoteSpeechStack } from "@internote/speech-service/cdk";
import { InternoteUiStack } from "@internote/ui/cdk";

import { InternoteProps } from "./constructs/internote-stack";
import { Stage } from "./env";

type AppProps = cdk.StackProps & { stage: Stage };

class InternoteApp extends cdk.Stack {
  public stage: Stage;

  constructor(scope: cdk.Construct, id: string, stackProps: AppProps) {
    super(scope, id, stackProps);

    new ssm.StringParameter(this, `${id}-STAGE`, {
      simpleName: false,
      parameterName: `/internote/${stackProps.stage}/STAGE`,
      stringValue: stackProps.stage,
      tier: ssm.ParameterTier.STANDARD,
    });

    const props: InternoteProps = {
      ...stackProps,
      account: this.account,
      region: this.region,
    };

    const { api, authenticatedRole, hostedZone } = new InternoteGatewayStack(
      this,
      `${id}-gateway`,
      props
    );

    const uiStack = new InternoteUiStack(this, `${id}-ui`, {
      ...props,
      hostedZone,
    });

    const speechStack = new InternoteSpeechStack(this, `${id}-speech-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    const preferencesStack = new InternotePreferencesStack(
      this,
      `${id}-preferences-service`,
      {
        ...props,
        api,
        authenticatedRole,
      }
    );

    const notesStack = new InternoteNotesStack(this, `${id}-notes-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    const snippetsStack = new InternoteSnippetsStack(
      this,
      `${id}-snippets-service`,
      {
        ...props,
        api,
        authenticatedRole,
      }
    );

    const dictionaryStack = new InternoteDictionaryStack(
      this,
      `${id}-dictionary-service`,
      {
        ...props,
        api,
        authenticatedRole,
      }
    );

    const exportStack = new InternoteExportStack(this, `${id}-export-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    console.log({
      uiStack: uiStack.toString(),
      speechStack: speechStack.toString(),
      preferencesStack: preferencesStack.toString(),
      notesStack: notesStack.toString(),
      snippetsStack: snippetsStack.toString(),
      dictionaryStack: dictionaryStack.toString(),
      exportStack: exportStack.toString(),
    });
  }
}

const app = new cdk.App();

const stages: Stage[] = ["cdk-test", "dev", "prod"];

stages.forEach((stage) => {
  new InternoteApp(app, `internote-${stage}`, {
    stage,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
});

app.synth();
