const webpack = require("webpack");
const dotenv = require("dotenv");

function getEnvPath() {
  switch (process.env.STAGE) {
    case "prod":
      return "./.env";
    case "dev":
      return "./.env.development";
    default:
      return "./.env.local";
  }
}

const { parsed: localEnv } = dotenv.config({
  path: getEnvPath(),
});

module.exports = function (nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
