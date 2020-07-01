import fs from "fs";
import path from "path";

import { PublicEnvKeys, publicEnvKeys } from "@internote/infra/env";
import AWS from "aws-sdk";
import SSM from "aws-sdk/clients/ssm";

const { stage } = require("minimist")(process.argv.slice(2));

if (!stage) {
  throw new Error("No stage specified, please specify one using --stage");
}

AWS.config.update({ region: "eu-west-1" });

const ssm = new SSM();

type EnvParam = { key: PublicEnvKeys; ssmName: string };

const envKeys: EnvParam[] = publicEnvKeys.map((key) => ({
  key,
  ssmName: `/internote/${stage}/${key}`,
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

const getEnv = async (): Promise<Record<string, any>> => {
  const envKeyValuePairs = await Promise.all(envKeys.map(getParam));
  return envKeyValuePairs.reduce(
    (acc, key) => ({ ...acc, [key.key]: key.value }),
    {}
  );
};

const generatePublicEnv = <E extends Record<string, any>>(env: E): E =>
  Object.keys(env).reduce(
    (acc, key) => ({ ...acc, [`REACT_APP_${key}`]: env[key] }),
    {} as E
  );

const writeDotEnv = async () => {
  const env = await getEnv();
  const publicEnv = generatePublicEnv(env);
  const dotenv = Object.keys(publicEnv).reduce(
    (acc, key) => `${acc}${key}=${publicEnv[key]}\n`,
    ""
  );
  fs.writeFileSync(path.resolve(__dirname, ".env"), dotenv);
};

const writeTsEnv = async () => {
  const env = await getEnv();
  const publicEnv = generatePublicEnv(env);
  const tsEnv = `
    export const env = {
      ${Object.keys(publicEnv).reduce(
        (acc, key) => `${acc}${key}: process.env.${key},\n`,
        ""
      )}
    }
  `;
  fs.writeFileSync(path.resolve(__dirname, "src", "env.ts"), tsEnv);
};

writeDotEnv();
writeTsEnv();
