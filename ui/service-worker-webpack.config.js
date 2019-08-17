const nodeExternals = require("webpack-node-externals");
const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");
const dotenv = require("dotenv");

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
  path: getEnvPath()
});

module.exports = {
  entry: "./service-worker/index.ts",
  output: {
    filename: "service-worker.js",
    path: path.resolve(__dirname, "public")
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts"]
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "awesome-typescript-loader" }]
  },
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../node_modules")
    })
  ],
  plugins: [new CheckerPlugin(), new webpack.EnvironmentPlugin(localEnv)]
};
