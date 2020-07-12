import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
import { InternoteDictionaryStack } from "@internote/dictionary-service/cdk";
import { InternoteExportStack } from "@internote/export-service/cdk";
import { InternoteGatewayStack } from "@internote/gateway-service/cdk";
import { InternoteNotesStack } from "@internote/notes-service/cdk";
import { InternotePreferencesStack } from "@internote/preferences-service/cdk";
import { InternoteSnippetsStack } from "@internote/snippets-service/cdk";
import { InternoteSpeechStack } from "@internote/speech-service/cdk";

import { InternoteProps } from "./constructs/internote-stack";
import { Stage, allStages } from "./env";

type AppProps = cdk.StackProps & { stage: Stage };

class InternoteApp extends cdk.Stack {
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

    const { api, authenticatedRole } = new InternoteGatewayStack(
      this,
      `${id}-gateway`,
      props
    );

    new InternoteSpeechStack(this, `${id}-speech-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    new InternotePreferencesStack(this, `${id}-preferences-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    new InternoteNotesStack(this, `${id}-notes-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    new InternoteSnippetsStack(this, `${id}-snippets-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    new InternoteDictionaryStack(this, `${id}-dictionary-service`, {
      ...props,
      api,
      authenticatedRole,
    });

    new InternoteExportStack(this, `${id}-export-service`, {
      ...props,
      api,
      authenticatedRole,
    });
  }
}

const app = new cdk.App();

allStages.forEach((stage) => {
  new InternoteApp(app, `internote-${stage}-be`, {
    stage,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
});

app.synth();
