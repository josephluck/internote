import { CreateHandler } from "@internote/lib/lambda";
import {
  encodeResponse,
  jsonErrorHandler,
  validateRequestBody,
} from "@internote/lib/middlewares";
import { exception, success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { inArray, isString, required } from "@internote/lib/validator";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import AWS from "aws-sdk";
import md5 from "md5";

import { availableVoices } from "../available-voices";
import { env } from "../env";
import {
  AvailableVoice,
  SpeechRequestBody,
  SpeechResponseBody,
} from "../types";

const validator = validateRequestBody<SpeechRequestBody>({
  id: [required],
  words: [required, isString],
  voice: [required, inArray(availableVoices)],
});

const speech: CreateHandler<SpeechRequestBody> = async (
  event,
  _ctx,
  callback
) => {
  try {
    console.log("[DEBUG]", "Started");
    const userId = getUserIdentityId(event);
    console.log("[DEBUG]", { userId });
    const chosenVoice: AvailableVoice = event.body.voice || "Male";
    const voiceId = chosenVoice === "Male" ? "Joey" : "Joanna";
    const Polly = new AWS.Polly();
    const S3 = new AWS.S3();

    const speech = await Polly.synthesizeSpeech({
      OutputFormat: "mp3",
      Text: event.body.words,
      TextType: "text",
      VoiceId: voiceId,
    }).promise();

    console.log("[DEBUG]", "Speech made");

    const hash = md5(event.body.words);
    console.log("[DEBUG]", { hash });
    const S3UploadKey = `private/${userId}/${event.body.id}/${hash}-${voiceId}.mp3`;
    console.log("[DEBUG]", { S3UploadKey });
    await S3.upload({
      Bucket: env.SPEECH_BUCKET_NAME,
      Key: S3UploadKey,
      Body: speech.AudioStream,
    }).promise();

    console.log("[DEBUG]", "Upload done");

    const response: SpeechResponseBody = {
      src: `https://s3-${env.SERVICES_REGION}.amazonaws.com/${env.SPEECH_BUCKET_NAME}/${S3UploadKey}`,
      key: S3UploadKey,
    };
    console.log("[DEBUG]", { response });
    return callback(null, success(response));
  } catch (err) {
    console.log("[DEBUG", err.toString(), { err });
    throw exception(err);
  }
};

export const handler = middy(speech)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
