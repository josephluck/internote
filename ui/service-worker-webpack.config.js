const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");
const dotenv = require("dotenv");
const webpack = require("webpack");

function getEnvPath() {
  switch (process.env.STAGE) {
    case "prod":
      return "./.env";
    case "dev":
      return "./.env.development";
    default:
      return "./.env.local";
  }
}

const { parsed: localEnv } = dotenv.config({
  path: getEnvPath(),
});

module.exports = {
  entry: "./service-worker/index.ts",
  output: {
    filename: "service-worker.js",
    path: path.resolve(__dirname, "public"),
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "awesome-typescript-loader" },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", { modules: false }],
          },
        },
      },
    ],
  },
  plugins: [new CheckerPlugin(), new webpack.EnvironmentPlugin(localEnv)],
};
