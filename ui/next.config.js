const path = require("path");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");
const withCss = require("@zeit/next-css");
const withSourceMaps = require("@zeit/next-source-maps")();
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

const env = {
  ATTACHMENTS_BUCKET_NAME: process.env.ATTACHMENTS_BUCKET_NAME,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  SERVICES_HOST: process.env.SERVICES_HOST,
  SERVICES_REGION: process.env.SERVICES_REGION,
  SPEECH_BUCKET_NAME: process.env.SPEECH_BUCKET_NAME,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
};

const missingEnvKeys = Object.keys(env).filter((key) => !Boolean(env[key]));

if (missingEnvKeys.length) {
  throw new Error(
    `Missing environment values for: ${missingEnvKeys.join(", ")}`
  );
}

const isProd = process.env.NODE_ENV === "production";

const withSentrySourceMaps = (nextConfig) =>
  Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias["@sentry/node"] = "@sentry/browser";
      }

      if (
        env.SENTRY_DSN &&
        env.SENTRY_ORG &&
        env.SENTRY_PROJECT &&
        env.SENTRY_AUTH_TOKEN &&
        isProd
      ) {
        config.plugins.push(
          new SentryWebpackPlugin({
            include: ".next",
            ignore: ["node_modules"],
            urlPrefix: "~/_next",
            release: options.buildId,
          })
        );
      }

      return typeof nextConfig.webpack === "function"
        ? nextConfig.webpack(config, options)
        : config;
    },
  });

const withExternals = (nextConfig) =>
  Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.externals = config.externals || [];
      return typeof nextConfig.webpack === "function"
        ? nextConfig.webpack(config, options)
        : config;
    },
  });

module.exports = withExternals(
  withCustomBabelConfig(
    withDotenv(
      withTranspile(
        withSentrySourceMaps(
          withSourceMaps(
            withCss({
              transpileModules: ["@internote"],
              babelConfigFile: path.resolve("./babel.config.js"),
              target: "serverless",
              experimental: { publicDirectory: true },
              env: env,
            })
          )
        )
      )
    )
  )
);
