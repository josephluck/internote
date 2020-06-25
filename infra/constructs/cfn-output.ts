import * as cdk from "@aws-cdk/core";

// import { Env } from "../env";

type Props = Omit<cdk.CfnOutputProps, "exportName">;

/**
 * TODO: this is bad. Use SSM directly.
 */
export class InternoteCfnOutput {
  // keyof Env
  constructor(scope: cdk.Construct, key: string, props: Props) {
    new cdk.CfnOutput(scope, key, { ...props, exportName: key });
  }
}
