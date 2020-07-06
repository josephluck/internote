const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");

const workspacePaths = [
  "attachments",
  "collaborate",
  "dictionary",
  "export",
  "gateway",
  "infra",
  "lib",
  "notes",
  "preferences",
  "snippets",
  "speech",
].map((p) => path.join(__dirname, "../", p));

const externalNodeModules = ["@josephluck/stately"].map((p) =>
  path.join(__dirname, "../", "node_modules", p)
);

const packagePaths = [...workspacePaths, ...externalNodeModules];

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );

      console.log({ isFound });

      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        console.log({ include, packagePaths });
        match.loader.include = include.concat(packagePaths);
      }

      return webpackConfig;
    },
  },
};
