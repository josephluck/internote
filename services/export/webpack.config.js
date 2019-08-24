const slsw = require("serverless-webpack");
const makeWebpackConfig = require("@internote/lib/make-webpack-config");

module.exports = {
  entry: slsw.lib.entries,
  ...makeWebpackConfig({ dirname: __dirname, relativeRoot: "../../" })
};
