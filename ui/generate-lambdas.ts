#! /usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";

/**
 * Points to the next.js build output directory
 * for lambda files.
 */
const nextServerlessBuildOutputDir = path.join(
  process.cwd(),
  ".next",
  "serverless",
  "pages"
);

function makeOutputFullPath({ outputDir }: Options) {
  return path.join(process.cwd(), outputDir);
}

function writeAwsLambda(outputDir: string, fileName: string, lambda: string) {
  fs.writeFileSync(path.join(outputDir, fileName), lambda, {
    encoding: "utf-8"
  });
  console.log(`✔ AWS λ created for ${fileName}`);
}

function createAwsLambda({ typescript }: Options, pageName: string) {
  if (typescript) {
    return `import * as compat from "next-aws-lambda";
import * as page from "../.next/serverless/pages/${pageName}";
module.exports.render = (event, _context, callback) => {
  const { req, res } = compat(page)(event, callback);
  page.render(req, res);
};
`;
  } else {
    return `var compat = require("next-aws-lambda");
var page = require("../.next/serverless/pages/${pageName}");
module.exports.render = (event, _context, callback) => {
  const { req, res } = compat(page)(event, callback);
  page.render(req, res);
};
`;
  }
}

function getFileNameFromPath(fileName: string) {
  return fileName.split(".js")[0];
}

interface Options {
  typescript?: boolean;
  outputDir?: string;
}

function run({
  typescript = true,
  outputDir = ".generated-lambdas"
}: Options = {}) {
  const outputFullPath = makeOutputFullPath({ outputDir });
  rimraf(outputFullPath);
  fs.mkdirSync(outputFullPath);

  fs.readdirSync(nextServerlessBuildOutputDir)
    .map(getFileNameFromPath)
    .forEach(pageName => {
      const fileName = typescript ? `${pageName}.ts` : `${pageName}.js`;
      const lambda = createAwsLambda({ typescript }, pageName);
      writeAwsLambda(outputFullPath, fileName, lambda);
    });
}

function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function(entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}

run({ typescript: true, outputDir: ".generated-lambdas" });
