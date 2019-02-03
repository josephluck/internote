#! /usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";

interface Records {
  chunks: {
    byName: Record<string, number>;
  };
}

const nextServerlessBuildOutputDir = path.join(
  process.cwd(),
  ".next",
  "serverless"
);

const awsLambdaOutDir = path.join(process.cwd(), ".lambdas");

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

function writeAwsLambda(lambdaPath: string, awsLambda: string) {
  fs.writeFileSync(path.join(awsLambdaOutDir, lambdaPath), awsLambda, {
    encoding: "utf-8"
  });
  console.log(`✔ AWS λ created for ${lambdaPath}`);
}

function createAwsLambda(pageName: string) {
  return `
    var pageProxy = require("aws-serverless-express");
    var nextLambda = require("../.next/serverless/pages/${pageName}");
    var pageHandler = pageProxy.createServer(function(req, res) {
      return nextLambda.render(req, res)
    });
    module.exports.handler = function(event, context) {
      pageProxy.proxy(pageHandler, event, context);
    };
  `;
}

function run() {
  rimraf(awsLambdaOutDir);
  fs.mkdirSync(awsLambdaOutDir);

  const records = getRecords();
  const files = records.chunks.byName;
  Object.keys(files)
    .filter(
      name =>
        !name.startsWith("pages/_app") && !name.startsWith("pages/_document")
    )
    .forEach(filePath => {
      const pageName = filePath.split("/")[1];
      const awsLambda = createAwsLambda(pageName);
      writeAwsLambda(pageName, awsLambda);
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

run();
