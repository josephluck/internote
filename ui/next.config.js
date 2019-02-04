const path = require("path");
const withTypescript = require("@zeit/next-typescript");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");

const isProd = process.env.NODE_ENV === "production";

module.exports = withCustomBabelConfig(
  withDotenv(
    withTypescript(
      withTranspile({
        transpileModules: ["@internote"],
        babelConfigFile: path.resolve("./babel.config.js"),
        target: "serverless",
        assetPrefix: process.env.ASSET_PREFIX || ""
      })
    )
  )
);
