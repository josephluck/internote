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
              const lemmas = await api.get(`/lemmas/en/${word}`);
              const wordId = getWordIdFromLemmasResponse(lemmas.data);
              const [entries, thesauras] = await Promise.all([
                api.get(`/entries/en-gb/${wordId}?strictMatch=false`),
                api.get(`/thesaurus/en/${wordId}?strictMatch=false`)
              ]);

              const mappedEntries = convertOxfordEntriesResponse(entries.data);
              const results = mapEntriesToSynonyms(
                mappedEntries,
                thesauras.data
              );

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

interface DictionaryResultWithThesaurasId extends DictionaryResult {
  thesaurasId: string;
}

function convertOxfordEntriesResponse(
  response: Oxford.EntriesResponse
): DictionaryResultWithThesaurasId[] {
  const mappedResult = [] as DictionaryResultWithThesaurasId[];
  response.results.forEach(({ word, lexicalEntries }) => {
    lexicalEntries.forEach(({ entries, lexicalCategory }) => {
      entries.forEach(({ senses }) => {
        senses.forEach(({ definitions, examples, thesaurusLinks }) => {
          const thesaurasId =
            thesaurusLinks && thesaurusLinks.length
              ? thesaurusLinks[0].sense_id
              : "";
          const example = examples && examples.length ? examples[0].text : "";
          definitions.forEach(definition => {
            mappedResult.push({
              word,
              lexicalCategory: lexicalCategory.text,
              definition,
              synonyms: [],
              example,
              thesaurasId
            });
          });
        });
      });
    });
  });
  return mappedResult;
}

function mapEntriesToSynonyms(
  dictionaryResults: DictionaryResultWithThesaurasId[],
  response: Oxford.ThesaurasResponse
): DictionaryResult[] {
  return dictionaryResults.map(({ thesaurasId, ...result }) => {
    let synonyms: string[] = [];
    response.results.forEach(({ lexicalEntries }) => {
      lexicalEntries.forEach(({ entries }) => {
        entries.forEach(({ senses }) => {
          const sense = senses.find(({ id }) => id === thesaurasId);
          if (sense && sense.synonyms) {
            synonyms = [
              ...synonyms,
              ...sense.synonyms.map(synonym => synonym.text)
            ];
          }
        });
      });
    });
    return { ...result, synonyms };
  });
}

function getWordIdFromLemmasResponse(response: Oxford.LemmasResponse): string {
  const result = response.results[0];
  const entry = result.lexicalEntries[0];
  const inflection = entry.inflectionOf[0];
  return inflection.id;
}

export default routes;
