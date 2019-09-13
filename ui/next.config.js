const path = require("path");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");
const withCss = require("@zeit/next-css");

const isProd = process.env.NODE_ENV === "production";

function withExternals(nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.externals = config.externals || [];
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  });
}

module.exports = withExternals(
  withCustomBabelConfig(
    withDotenv(
      withTranspile(
        withCss({
          transpileModules: ["@internote"],
          babelConfigFile: path.resolve("./babel.config.js"),
          target: "serverless",
          experimental: { publicDirectory: true },
          env: {
            ATTACHMENTS_BUCKET_NAME: process.env.ATTACHMENTS_BUCKET_NAME,
            COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
            COGNITO_USER_POOL_CLIENT_ID:
              process.env.COGNITO_USER_POOL_CLIENT_ID,
            COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
            SERVICES_HOST: process.env.SERVICES_HOST,
            SERVICES_REGION: process.env.SERVICES_REGION,
            SPEECH_BUCKET_NAME: process.env.SPEECH_BUCKET_NAME
          }
        })
      )
    )
  )
);
