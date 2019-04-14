#! /usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";

/**
 * Refers to the records.json that next.js exports
 * when a build is run. Necessary since it contains
 * the directory name and information surrounding the
 * most recent build of the application,
 */
interface Records {
  chunks: {
    byName: Record<string, number>;
  };
}

/**
 * Points to the next.js build output directory
 * for lambda files.
 */
const nextServerlessBuildOutputDir = path.join(
  process.cwd(),
  ".next",
  "serverless"
);

function makeOutputFullPath({ outputDir }: Options) {
  return path.join(process.cwd(), outputDir);
}

function getRecords(): Records {
  const recordsPath = path.join(nextServerlessBuildOutputDir, "records.json");

  try {
    fs.accessSync(recordsPath);
  } catch (e) {
    throw new Error(
      `Could not find build output in "${recordsPath}", are you sure you ran "next build"?`
    );
  }

  const recordsFile = fs.readFileSync(recordsPath, { encoding: "utf-8" });

  return JSON.parse(recordsFile);
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

interface Options {
  typescript?: boolean;
  outputDir?: string;
}

function run({
  typescript = true,
  outputDir = "generated-lambdas"
}: Options = {}) {
  const outputFullPath = makeOutputFullPath({ outputDir });
  rimraf(outputFullPath);
  fs.mkdirSync(outputFullPath);

  const records = getRecords();
  const files = records.chunks.byName;

  Object.keys(files)
    .filter(
      name =>
        !name.startsWith("pages/_app") && !name.startsWith("pages/_document")
    )
    .map(fileName => fileName.split("/")[1].split(".js")[0])
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

run({ typescript: true, outputDir: "generated-lambdas" });
