const webpack = require("webpack");
const dotenv = require("dotenv");

const { parsed: localEnv } = dotenv.config({
  path:
    process.env.STAGE === "prod"
      ? "./.env"
      : process.env.STAGE === "dev"
      ? "./.env.development"
      : "./.env.local"
});

module.exports = function(nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
