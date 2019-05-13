import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { route } from "../router";
import { Option } from "space-lift";
import { UserEntity } from "../entities";
import * as AWS from "aws-sdk";
import * as md5 from "md5";
import { validate, rules } from "../../dependencies/validation";
import { AvailableVoice } from "../preferences/entity";

export interface GenerateRequest {
  noteId: string;
  content: string;
  voice?: AvailableVoice;
}
export interface GenerateResponse {
  src: string;
}

function makeController(deps: Dependencies) {
  return {
    async generate(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          ctx.body = deps.messages.throw(ctx, deps.messages.notFound("user"));
          return ctx;
        },
        async () => {
          return validate<GenerateRequest>(ctx.request.body, {
            noteId: [rules.required],
            content: [rules.required]
          }).fold(
            () => {
              return deps.messages.throw(
                ctx,
                deps.messages.badRequest("Speech")
              );
            },
            async request => {
              const voiceId = request.voice || "Joey";
              const Polly = new AWS.Polly();
              const S3 = new AWS.S3();

              const speech = await Polly.synthesizeSpeech({
                OutputFormat: "mp3",
                Text: request.content,
                TextType: "text",
                VoiceId: voiceId
              }).promise();

              const hash = md5(request.content);
              const S3UploadPath = `${request.noteId}-${hash}-${voiceId}.mp3`;

              await S3.upload({
                Bucket: process.env.SPEECH_BUCKET,
                Key: S3UploadPath,
                Body: speech.AudioStream,
                ACL: "public-read"
              }).promise();

              const src = `https://s3-${process.env.REGION}.amazonaws.com/${
                process.env.SPEECH_BUCKET
              }/${S3UploadPath}`;

              ctx.body = { src };
              return ctx.body;
            }
          );
        }
      );
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);

    router.post("/speech", deps.auth, route(deps, controller.generate));

    return router;
  };
}

export default routes;
