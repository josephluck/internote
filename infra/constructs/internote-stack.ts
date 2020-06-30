import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";

import { Env, Stage } from "../env";

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
  exportToSSM<K extends keyof Env>(key: K, value: Env[K]) {
    new ssm.StringParameter(this, `${this.rootId}-${key}`, {
      simpleName: false,
      parameterName: `/internote/${this.stage}/${key}`,
      stringValue: value,
      tier: ssm.ParameterTier.STANDARD,
    });
  }

  // TODO: constrain this type to env variables that aren't generated through
  // CDK
  importFromSSM<K extends keyof Env>(key: K): Env[K] {
    return ssm.StringParameter.valueForStringParameter(
      this,
      `/internote/${this.stage}/${key}`
    ) as Env[K];
  }
}
