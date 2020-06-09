import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import {
  encodeResponse,
  jsonErrorHandler,
  validateRequestBody,
} from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { CreateHandler } from "@internote/lib/types";
import { CreateExportDTO, ExportResponseDTO } from "./types";
import { serialize } from "./serializers/html";
import { required, isString } from "@internote/lib/validator";
import AWS from "aws-sdk";
import md5 from "md5";

const validator = validateRequestBody<CreateExportDTO>({
  title: [required, isString],
  content: [required],
});

const html: CreateHandler<CreateExportDTO> = async (event, _ctx, callback) => {
  const S3 = new AWS.S3();
  const { title, content } = event.body;
  const output = serialize(content.document);
  const hash = md5(output);
  const S3UploadPath = `${title} - ${hash}.html`;
  await S3.upload({
    Bucket: process.env.EXPORT_BUCKET,
    Key: S3UploadPath,
    Body: output,
    ACL: "public-read",
  }).promise();

  const src = `https://s3-${process.env.REGION}.amazonaws.com/${process.env.EXPORT_BUCKET}/${S3UploadPath}`;

  const response: ExportResponseDTO = { src };

  return callback(null, success(response));
};

export const handler = middy(html)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
