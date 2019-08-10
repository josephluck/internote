module.exports = {
  entry: "./src/service-worker/index.ts",
  output: {
    filename: "service-worker.js",
    path: path.resolve(__dirname, ".service-worker")
  },
  resolve: {
    extensions: ["", ".ts"]
  },
  module: {
    loaders: [{ test: /\.ts$/, loader: "ts-loader" }]
  }
};
