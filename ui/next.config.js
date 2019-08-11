const path = require("path");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");

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
      withTranspile({
        transpileModules: ["@internote"],
        babelConfigFile: path.resolve("./babel.config.js"),
        target: "serverless",
        assetPrefix: process.env.ASSET_PREFIX || ""
      })
    )
  )
);
