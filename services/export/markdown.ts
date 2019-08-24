import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { CreateHandler } from "@internote/lib/types";
import { CreateExportDTO } from "./types";

const markdown: CreateHandler<CreateExportDTO> = async (
  _event,
  _ctx,
  callback
) => {
  const markdown = {};
  return callback(null, success(markdown));
};

export const handler = middy(markdown)
  .use(jsonBodyParser())
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
