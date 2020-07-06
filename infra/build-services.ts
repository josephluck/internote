import fs from "fs";
import path from "path";

import nodeBuiltIns from "builtin-modules";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import execa from "execa";
import rimraf from "rimraf";
import webpack from "webpack";

const { argv } = require("yargs");

if (!argv.stage) {
  throw new Error("Please specify a --stage");
}

console.log(`Building stage ${argv.stage}`);

const services = [
  // "attachments",
  "gateway",
  // "collaborate",
  "dictionary",
  "export",
  "notes",
  "preferences",
  "snippets",
  "speech",
  "ui",
];

export const buildServices = async () =>
  await Promise.all(services.map(buildService));

const buildService = async (service: string) => {
  if (service === "ui") {
    const opts: execa.Options<string> = {
      cwd: path.resolve(process.cwd(), "../"),
    };
    console.log("Preparing UI environment");
    await execa(
      "yarn",
      ["workspace", "@internote/ui", `env:${argv.stage}`],
      opts
    );
    console.log("Building UI");
    await execa("yarn", ["workspace", "@internote/ui", "build"], opts);
    console.log("Built UI");
    return;
  }

  console.log(`Building the ${service} service`);

  return new Promise(async (resolve, reject) => {
    webpack(await makeWebpackConfig(service)).run((err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`Built ${service} service`);
      console.log("-");
      resolve();
    });
  });
};

const makeWebpackConfig = async (
  service: string
): Promise<webpack.Configuration> => {
  const rootDir = path.join(__dirname, "../");
  const serviceDir = path.join(rootDir, service);

  const inputPath = path.join(serviceDir, "lambdas");
  const outputPath = path.join(serviceDir, ".build");
  const rootNodeModulesPath = path.join(rootDir, "node_modules");

  if (!fs.existsSync(inputPath)) {
    throw new Error(
      `No source lambdas found for ${service} at path ${inputPath}`
    );
  }

  /**
   * Manually cleans out the .build directory
   */
  if (fs.existsSync(outputPath)) {
    rimraf.sync(outputPath);
    fs.mkdirSync(outputPath, { recursive: true });
  }

  return {
    entry: await makeWebpackEntries(inputPath),
    resolve: {
      extensions: [".json", ".ts", ".js"],
      modules: [rootNodeModulesPath],
    },
    output: {
      path: outputPath,
      libraryTarget: "commonjs",
      filename: "[name].js",
    },
    externals,
    target: "node",
    optimization: {
      minimize: false,
    },
    mode: "production",
    plugins: [new CleanWebpackPlugin()],
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
    devtool: "source-map",
  };
};

const externals = ["aws-sdk"].concat(nodeBuiltIns).reduce(
  (externalsMap, moduleName) => ({
    ...externalsMap,
    [moduleName]: moduleName,
  }),
  {}
);

/**
 * TODO: document why this is necessary
 */
const makeWebpackEntries = (source: string): Promise<Record<string, string>> =>
  new Promise((resolve, reject) => {
    fs.readdir(source, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const filePaths = files.reduce((acc, file) => {
        const fileNameWithoutExtension = file.split(".")[0];
        const fullPath = path.join(source, file);
        return {
          ...acc,
          [fileNameWithoutExtension]: ["source-map-support/register", fullPath],
        };
      }, {});
      resolve(filePaths);
    });
  });

buildServices();
