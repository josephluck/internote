import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";

import {
  GeneratedEnv,
  GeneratedEnvKeys,
  ManualEnv,
  ManualEnvKeys,
  Stage,
} from "../env";

export type InternoteProps = cdk.StackProps & {
  stage: Stage;
  account: string;
  region: string;
};

export class InternoteStack extends cdk.Construct {
  private rootId: string;
  public stage: Stage;
  public region: string = "eu-west-1";

  constructor(scope: cdk.Construct, id: string, options: InternoteProps) {
    super(scope, id);

    this.rootId = id;
    this.stage = options.stage;
  }

  // TODO: constrain this type to only env variables that are generated through
  // CDK
  exportToSSM<K extends GeneratedEnvKeys>(
    key: K,
    value: GeneratedEnv[K],
    isPublic?: boolean
  ) {
    new ssm.StringParameter(this, `${this.rootId}-${key}`, {
      simpleName: false,
      parameterName: `/internote/${this.stage}/${key}`,
      stringValue: value,
      tier: ssm.ParameterTier.STANDARD,
    });
    if (isPublic) {
      new ssm.StringParameter(this, `${this.rootId}-${key}`, {
        simpleName: false,
        parameterName: `/internote/${this.stage}/REACT_APP_${key}`,
        stringValue: value,
        tier: ssm.ParameterTier.STANDARD,
      });
    }
  }

  // TODO: constrain this type to env variables that aren't generated through
  // CDK
  importFromSSM<K extends ManualEnvKeys>(key: K): ManualEnv[K] {
    return ssm.StringParameter.valueForStringParameter(
      this,
      `/internote/${this.stage}/${key}`
    ) as ManualEnv[K];
  }
}
