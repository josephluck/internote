const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    "monaco-expose": "./monaco-expose.js",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker"
  },
  output: {
    globalObject: "self",
    filename: "[name].js",
    path: path.resolve(__dirname, "static/monaco")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!react-monaco-editor)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      reactMonacoEditor: "react-monaco-editor"
    })
  ]
};
