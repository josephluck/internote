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
    return `import * as pageProxy from "aws-serverless-express";
import * as nextLambda from "../.next/serverless/pages/${pageName}";

const pageHandler = pageProxy.createServer((req, res) => {
  return (nextLambda as any).render(req, res);
});

module.exports.handler = (event, context) => {
  pageProxy.proxy(pageHandler, event, context);
};
`;
  } else {
    return `var pageProxy = require("aws-serverless-express");
var nextLambda = require("../.next/serverless/pages/${pageName}");
var pageHandler = pageProxy.createServer(function(req, res) {
  return nextLambda.render(req, res)
});
module.exports.handler = function(event, context) {
  pageProxy.proxy(pageHandler, event, context);
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
