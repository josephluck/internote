import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";

import { Env } from "../env";

export class InternoteStack extends cdk.Stack {
  private rootId: string;
  private stage: "cdk" = "cdk"; // TODO: get from context?

  constructor(scope: cdk.Construct, id: string, options?: cdk.StackProps) {
    super(scope, id, options);

    this.rootId = id;
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
