import StaticFileHandler from "serverless-aws-static-file-handler";
import * as path from "path";

const clientFilesPath = path.join(__dirname, "../.service-worker/");
const fileHandler = new StaticFileHandler(clientFilesPath);

export const handler = async (event, context) => {
  return fileHandler.get(event, context);
};
