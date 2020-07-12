import AWS from "aws-sdk";
import SSM from "aws-sdk/clients/ssm";

import { ManualEnvKeys, manualEnvKeys } from "./env";

const { from, destination } = require("minimist")(process.argv.slice(2));

if (!from) {
  throw new Error("No from specified, please specify one using --from");
}
if (!destination) {
  throw new Error(
    "No destination specified, please specify one using --destination"
  );
}

AWS.config.update({ region: "eu-west-1" });

const ssm = new SSM();

type EnvParam = { key: ManualEnvKeys; ssmName: string };

const fromEnvKeys: EnvParam[] = manualEnvKeys.map((key) => ({
  key,
  ssmName: `/internote/${from}/${key}`,
}));

const destinationEnvKeys: EnvParam[] = manualEnvKeys.map((key) => ({
  key,
  ssmName: `/internote/${destination}/${key}`,
}));

const getParam = ({ key, ssmName }: EnvParam): Promise<any> =>
  new Promise((resolve) => {
    ssm.getParameter({ Name: ssmName }, (err, data) => {
      if (err) {
        console.log("Error getting param", { key });
        throw err;
      }
      if (!data || !data.Parameter || !data.Parameter.Value) {
        throw new Error(`No parameter value found in SSM for ${key}`);
      }
      resolve({ key, value: data.Parameter.Value });
    });
  });

const writeParam = ({ key, ssmName }: EnvParam, value: any): Promise<any> =>
  new Promise((resolve) => {
    ssm.putParameter(
      { Name: ssmName, Value: value, Overwrite: true, Type: "String" },
      (err) => {
        if (err) {
          console.log("Error writing param", { key });
          throw err;
        }
        resolve();
      }
    );
  });

const getFromEnv = async (): Promise<Record<string, any>> => {
  const envKeyValuePairs = await Promise.all(fromEnvKeys.map(getParam));
  return envKeyValuePairs.reduce(
    (acc, key) => ({ ...acc, [key.key]: key.value }),
    {}
  );
};

const copyEnv = async () => {
  const env = await getFromEnv();
  console.log({ env, destinationEnvKeys });
  await Promise.all(
    Object.keys(env).map(async (key) => {
      await writeParam(
        destinationEnvKeys.find((k) => k.key === key),
        key === "STAGE" ? destination : env[key]
      );
    })
  );
};

copyEnv();
