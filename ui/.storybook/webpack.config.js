const path = require("path");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const withTM = require("next-plugin-transpile-modules");

module.exports = function(_, _, config) {
  config.node = {
    ...config.node,
    fs: "empty"
  };
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: "awesome-typescript-loader",
        options: {
          configFileName: "tsconfig.storybook.json",
          useCache: true
        }
      }
    ]
  });
  config.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", "css-loader"]
  });
  config.module.rules.push({
    test: /\.(png|jpg|jpeg)$/,
    use: [
      {
        loader: "file-loader",
        options: {}
      }
    ],
    include: path.resolve(__dirname, "../")
  });
  config.resolve.plugins = config.resolve.plugins || [];
  config.resolve.plugins.push(
    new TsConfigPathsPlugin({ configFileName: "tsconfig.storybook.json" })
  );
  config.resolve.extensions.push(".ts", ".tsx");
  config.externals = config.externals || [];

  return withTM({}).webpack(config, {
    transpileModules: ["@internote"],
    defaultLoaders: {
      babel: "babel-loader"
    }
  });
};
