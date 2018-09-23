const withTypescript = require("@zeit/next-typescript");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");

module.exports = withDotenv(
  withTypescript(
    withTranspile({
      transpileModules: ["@internote", "styled-icons"]
    })
  )
);
