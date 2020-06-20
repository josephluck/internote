import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import {
  encodeResponse,
  validateRequestBody,
  jsonErrorHandler,
} from "@internote/lib/middlewares";
import { success, exception } from "@internote/lib/responses";
import { CreateHandler } from "@internote/lib/lambda";
import { SpeechRequestBody, SpeechResponseBody, AvailableVoice } from "./types";
import { required, inArray, isString } from "@internote/lib/validator";
import AWS from "aws-sdk";
import md5 from "md5";
import { availableVoices } from "./available-voices";
import { getUserIdentityId } from "@internote/lib/user";

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
      Bucket: process.env.SPEECH_BUCKET,
      Key: S3UploadKey,
      Body: speech.AudioStream,
    }).promise();

    console.log("[DEBUG]", "Upload done");

    const response: SpeechResponseBody = {
      src: `https://s3-${process.env.REGION}.amazonaws.com/${process.env.SPEECH_BUCKET}/${S3UploadKey}`,
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
  .use(cors());
