import { CreateHandler } from "@internote/lib/lambda";
import {
  encodeResponse,
  jsonErrorHandler,
  validateRequestBody,
} from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { isString, required } from "@internote/lib/validator";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import AWS from "aws-sdk";
import md5 from "md5";

import { env } from "../env";
import { serializeHtml } from "../serializers/html";
import { CreateExportDTO, ExportResponseDTO } from "../types";

const validator = validateRequestBody<CreateExportDTO>({
  title: [required, isString],
  content: [required],
});

const html: CreateHandler<CreateExportDTO> = async (event, _ctx, callback) => {
  const S3 = new AWS.S3();
  const { title, content } = event.body;
  const output = serializeHtml(content);
  const hash = md5(output);
  const S3UploadPath = `${title} - ${hash}.html`;
  await S3.upload({
    Bucket: env.EXPORT_BUCKET_NAME,
    Key: S3UploadPath,
    Body: output,
    ACL: "public-read",
  }).promise();

  const src = `https://s3-${env.SERVICES_REGION}.amazonaws.com/${env.EXPORT_BUCKET_NAME}/${S3UploadPath}`;

  const response: ExportResponseDTO = { src };

  return callback(null, success(response));
};

export const handler = middy(html)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
