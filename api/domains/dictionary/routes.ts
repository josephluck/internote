import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { route } from "../router";
import { Option, Some, None } from "space-lift";
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

api.interceptors.request.use(request => {
  console.log("Dictionary: oxford API request", request);
  return request;
});

api.interceptors.response.use(response => {
  console.log("Dictionary: oxford API response", response);
  return response;
});

function makeController(deps: Dependencies) {
  return {
    async lookup(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      const throwError = (message: string) => (err: Error) => {
        console.log("Dictionary error", err);
        deps.messages.throw(ctx, deps.messages.serverError(message));
        throw err;
      };
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
              try {
                const lemmas = await api
                  .get(`/lemmas/en/${word.toLowerCase()}`)
                  .catch(throwError("Lemmas request failed"));

                return getWordIdFromLemmasResponse(lemmas.data).fold(
                  () => throwError("Lemmas request failed")(new Error()),
                  async wordId => {
                    const entriesResponse = await api
                      .get(`/entries/en-gb/${wordId}?strictMatch=false`)
                      .catch(throwError("Entries request failed"));

                    const entries = convertOxfordEntriesResponse(
                      entriesResponse.data
                    );

                    function returnOnlyDictionaryEntries() {
                      ctx.body = {
                        results: entries.map(({ thesaurasId, ...rest }) => rest)
                      };
                      return ctx.body;
                    }

                    try {
                      const thesaurasResponse = await api
                        .get(`/thesaurus/en/${wordId}?strictMatch=false`)
                        .catch(throwError("Thesauras request failed"));

                      if (thesaurasResponse.data) {
                        const results = mapEntriesToSynonyms(
                          entries,
                          thesaurasResponse.data
                        );
                        ctx.body = {
                          results
                        };
                        return ctx.body;
                      } else {
                        throw new Error("No thesauras entries");
                      }
                    } catch (err) {
                      console.log("Thesauras was empty", err);
                      return returnOnlyDictionaryEntries();
                    }
                  }
                );
              } catch (err) {
                console.log("Dictionary failed", err);
                deps.messages.throw(ctx, deps.messages.notFound("Dictionary"));
              }
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
  (response.results || []).forEach(({ word, lexicalEntries }) => {
    (lexicalEntries || []).forEach(({ entries, lexicalCategory }) => {
      (entries || []).forEach(({ senses }) => {
        (senses || []).forEach(({ definitions, examples, thesaurusLinks }) => {
          const thesaurasId =
            thesaurusLinks && thesaurusLinks.length
              ? thesaurusLinks[0].sense_id
              : "";
          const example = examples && examples.length ? examples[0].text : "";
          (definitions || []).forEach(definition => {
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
    (response.results || []).forEach(({ lexicalEntries }) => {
      (lexicalEntries || []).forEach(({ entries }) => {
        (entries || []).forEach(({ senses }) => {
          const sense = senses.find(({ id }) => id === thesaurasId);
          if (sense && sense.synonyms) {
            synonyms.concat(sense.synonyms.map(s => s.text));
          }
        });
      });
    });
    return { ...result, synonyms };
  });
}

function getFirstItemFromArray<A>(arr: A[]): Option<A> {
  return arr && arr.length > 0 ? Some(arr[0]) : None;
}

function getWordIdFromLemmasResponse(
  response: Oxford.LemmasResponse
): Option<string> {
  return getFirstItemFromArray(response.results)
    .flatMap(lemma => getFirstItemFromArray(lemma.lexicalEntries))
    .flatMap(entry => getFirstItemFromArray(entry.inflectionOf))
    .map(inflection => inflection.id);
}

export default routes;
