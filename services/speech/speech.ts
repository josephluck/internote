import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import {
  encodeResponse,
  validateRequestBody,
  jsonErrorHandler
} from "@internote/lib/middlewares";
import { success, exception } from "@internote/lib/responses";
import { CreateHandler } from "@internote/lib/types";
import { SpeechRequestBody, SpeechResponseBody, AvailableVoice } from "./types";
import { required, inArray, isString } from "@internote/lib/validator";
import AWS from "aws-sdk";
import md5 from "md5";

export const availableVoices: AvailableVoice[] = ["Male", "Female"];

const validator = validateRequestBody<SpeechRequestBody>({
  id: [required],
  words: [required, isString],
  voice: [required, inArray(availableVoices)]
});

const speech: CreateHandler<SpeechRequestBody> = async (
  event,
  _ctx,
  callback
) => {
  try {
    const chosenVoice: AvailableVoice = event.body.voice || "Male";
    const voiceId = chosenVoice === "Male" ? "Joey" : "Joanna";
    const Polly = new AWS.Polly();
    const S3 = new AWS.S3();

    const speech = await Polly.synthesizeSpeech({
      OutputFormat: "mp3",
      Text: event.body.words,
      TextType: "text",
      VoiceId: voiceId
    }).promise();

    const hash = md5(event.body.words);
    const S3UploadPath = `${event.body.id}-${hash}-${voiceId}.mp3`;

    await S3.upload({
      Bucket: process.env.SPEECH_BUCKET,
      Key: S3UploadPath,
      Body: speech.AudioStream,
      ACL: "public-read"
    }).promise();

    const src = `https://s3-${process.env.REGION}.amazonaws.com/${
      process.env.SPEECH_BUCKET
    }/${S3UploadPath}`;

    const response: SpeechResponseBody = { src };
    return callback(null, success(response));
  } catch (err) {
    throw exception(err);
  }
};

export const handler = middy(speech)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
