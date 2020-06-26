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

  exportToSSM<K extends keyof Env>(key: K, value: Env[K]) {
    new ssm.StringParameter(this, `${this.rootId}-${key}`, {
      simpleName: false,
      parameterName: `/internote/${this.stage}/${key}`,
      stringValue: value,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
