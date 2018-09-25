const path = require("path");
const withTypescript = require("@zeit/next-typescript");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");

module.exports = withCustomBabelConfig(
  withDotenv(
    withTypescript(
      withTranspile({
        transpileModules: ["@internote", "styled-icons"],
        babelConfigFile: path.resolve('../babel.config.js'),
      })
    )
  )
);
