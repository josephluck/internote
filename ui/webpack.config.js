const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  // NB: https://github.com/webpack/webpack/issues/1599
  node: {
    __dirname: true,
    __filename: true
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: ".next/**"
      },
      {
        from: "static/**"
      }
    ])
  ],
  devtool: "source-map",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: __dirname,
        exclude: /node_modules/
      }
    ]
  }
};
