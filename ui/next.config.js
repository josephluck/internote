const path = require("path");
const withTranspile = require("next-plugin-transpile-modules");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");
// const withCss = require("@zeit/next-css");
const withSourceMaps = require("@zeit/next-source-maps")();
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const {
  envKeys,
  validateProcessEnv,
  nextEnv,
  validateEnv,
  nextEnvKeys,
} = require("./env-build");

validateProcessEnv(envKeys);
validateEnv(nextEnvKeys, nextEnv);

const withSentrySourceMaps = (nextConfig) =>
  Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias["@sentry/node"] = "@sentry/browser";
      }

      if (
        nextEnv.SENTRY_DSN &&
        nextEnv.SENTRY_ORG &&
        nextEnv.SENTRY_PROJECT &&
        nextEnv.SENTRY_AUTH_TOKEN &&
        process.env.NODE_ENV === "production"
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
    withTranspile(
      withSentrySourceMaps(
        withSourceMaps({
          transpileModules: ["@internote"],
          babelConfigFile: path.resolve("./babel.config.js"),
          target: "serverless",
          env: nextEnv,
        })
      )
    )
  )
);
