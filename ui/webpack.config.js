const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
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
  externals: [
    nodeExternals({
      whiteList: ["styled-components"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
};
