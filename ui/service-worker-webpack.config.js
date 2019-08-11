const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");

module.exports = {
  entry: "./service-worker/index.ts",
  output: {
    filename: "service-worker.js",
    // path: path.resolve(__dirname, ".service-worker")
    path: path.resolve(__dirname, "public")
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts"]
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "awesome-typescript-loader" }]
  },
  plugins: [new CheckerPlugin()]
};