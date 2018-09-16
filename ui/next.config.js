const withTypescript = require("@zeit/next-typescript");
const withTranspile = require("next-plugin-transpile-modules");

module.exports = withTypescript(
  withTranspile({
    transpileModules: ["@internote", "styled-icons"]
  })
);
