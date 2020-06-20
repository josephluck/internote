const path = require("path");
const nodeExternals = require("webpack-node-externals");

/**
 * Config is an object containing:
 *
 * {
 *    dirname: is the path to the root of the package (that contains the webpack.config.js file)
 *    relativeRoot: is the path to the root of the monorepo (that contains the top level package.json file)
 * }
 */
module.exports = function (config) {
  return {
    resolve: {
      extensions: [".json", ".ts", ".js"],
    },
    output: {
      libraryTarget: "commonjs",
      path: path.join(config.dirname, ".webpack"),
      filename: "[name].js",
    },
    optimization: {
      minimize: false,
    },
    target: "node",
    devtool: "source-map",
    mode: "production",
    externals: [
      nodeExternals({
        modulesDir: path.resolve(
          config.dirname,
          config.relativeRoot,
          "node_modules"
        ),
        whitelist: [/^@internote/],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                happyPackMode: true,
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
  };
};
