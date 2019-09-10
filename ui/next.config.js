const path = require("path");
const withTranspile = require("next-plugin-transpile-modules");
const withDotenv = require("./with-dotenv");
const withCustomBabelConfig = require("next-plugin-custom-babel-config");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withCss = require("@zeit/next-css");

const isProd = process.env.NODE_ENV === "production";

function withExternals(nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.externals = config.externals || [];
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  });
}

// TODO: https://github.com/Microsoft/monaco-editor-webpack-plugin/issues/32#issuecomment-447618998
function withMonacoEditor(nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.output = {
        ...config.output,
        globalObject: "self"
      };

      config.plugins = config.plugins || [];
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ["javascript", "typescript"],
          output: "../static" // NB: this places the webworkers for monaco into the static directory ready to be served
        })
      );
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  });
}

module.exports = withExternals(
  withCustomBabelConfig(
    withDotenv(
      withTranspile(
        withMonacoEditor(
          withCss({
            transpileModules: [
              "@internote",
              "monaco-editor",
              "react-monaco-editor"
            ],
            babelConfigFile: path.resolve("./babel.config.js"),
            target: "serverless",
            experimental: { publicDirectory: true }
          })
        )
      )
    )
  )
);
