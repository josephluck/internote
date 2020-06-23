const { Component } = require("@serverless/core");
const AWS = require("aws-sdk");

const { ssmEnvKeys, validateEnv } = require("./env-build");

module.exports = class InternoteUi extends Component {
  async default(inputs = { stage: "dev", name: "internote-ui" }) {
    const template = await this.load("@serverless/template", inputs.stage);
    const env = await getSSMEnv(inputs.stage);

    validateEnv(ssmEnvKeys, env);

    // TODO: storybook
    const output = await template({
      template: {
        name: inputs.name,
        app: {
          component: "serverless-next.js",
          inputs: {
            bucketName: "internote-ui",
            build: {
              env,
            },
          },
        },
      },
    });

    return { env, ...output };
  }

  async remove(inputs = { env: "dev" }) {
    const current = await this.load("@serverless/template", inputs.env);

    await current.remove();

    return {};
  }
};

const ssm = new AWS.SSM({ region: "eu-west-1" });

/**
 * Returns environment variables from AWS SSM
 */
const getSSMEnv = async (stage = "dev") => {
  const arr = await Promise.all(
    ssmEnvKeys.map(async (key) => {
      const name = `/internote/${stage}/${key}`;
      try {
        const param = await ssm
          .getParameter({
            Name: name,
            WithDecryption: false,
          })
          .promise();
        if (!param.Parameter || !param.Parameter.Value) {
          throw new Error();
        }
        return [key, param.Parameter.Value];
      } catch (err) {
        throw new Error(`Could not find value ${name} in AWS SSM.`);
      }
    })
  );
  return arr.reduce((acc, pair) => ({ ...acc, [pair[0]]: pair[1] }), {});
};

const merge = (obj1, obj2) => ({ ...obj1, ...obj2 });
