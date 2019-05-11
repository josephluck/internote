import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { route } from "../router";
import { Option } from "space-lift";
import { UserEntity } from "../entities";
import { validate, rules } from "../../dependencies/validation";
import { DictionaryResult } from "./entity";
import Axios from "axios";
import { Oxford } from "../../oxford";

export interface LookupRequest {
  word: string;
}

export interface LookupResponse {
  results: DictionaryResult[];
}

const api = Axios.create({
  baseURL: "https://od-api.oxforddictionaries.com:443/api/v2",
  headers: {
    app_id: process.env.OXFORD_API_ID,
    app_key: process.env.OXFORD_API_KEY
  }
});

function makeController(deps: Dependencies) {
  return {
    async lookup(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          ctx.body = deps.messages.throw(ctx, deps.messages.notFound("user"));
          return ctx;
        },
        async () => {
          return validate<LookupRequest>(ctx.request.body, {
            word: [rules.required]
          }).fold(
            () => {
              return deps.messages.throw(
                ctx,
                deps.messages.badRequest("Dictionary")
              );
            },
            async ({ word }) => {
              // TODO: may need to get the wordId using https://developer.oxforddictionaries.com/documentation#!/Lemmas
              const wordId = word;
              const [entries, thesauras] = await Promise.all([
                api.get(`/entries/en-gb/${wordId}?strictMatch=false`),
                api.get(`/thesaurus/en/${wordId}?strictMatch=false`)
              ]);

              console.log("Entries response", { entries });
              console.log("Thesauras response", { thesauras });
              const results = convertOxfordEntriesResponse(entries.data);
              console.log("Transformed response", { results });

              ctx.body = { results };

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

    router.post("/dictionary", deps.auth, route(deps, controller.lookup));

    return router;
  };
}

export function convertOxfordEntriesResponse(
  response: Oxford.EntriesResponse
): Partial<DictionaryResult>[] {
  return response.results.map(result => {
    const word = result.word;
    const lexicalEntry = result.lexicalEntries[0];
    const lexicalCategory = lexicalEntry.lexicalCategory.text;
    const entry = lexicalEntry.entries[0];
    const sense = entry.senses[0];
    const definition = sense.definitions[0];
    return {
      word,
      lexicalCategory,
      definition,
      synonyms: ["example"]
    };
  });
}

export default routes;
