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
                        results: entries.map(
                          ({ thesaurasSenseIds, ...rest }) => rest
                        )
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

interface DictionaryResultWithThesaurasSenseIds extends DictionaryResult {
  thesaurasSenseIds: string[];
}

// TODO: refactor this to split out functions for mapping
// data. Maybe use reduce & flatten combinations
function convertOxfordEntriesResponse(
  response: Oxford.EntriesResponse
): DictionaryResultWithThesaurasSenseIds[] {
  const mappedResult = [] as DictionaryResultWithThesaurasSenseIds[];
  (response.results || []).forEach(({ word, lexicalEntries }) => {
    (lexicalEntries || []).forEach(({ entries, lexicalCategory }) => {
      (entries || []).forEach(({ senses }) => {
        (senses || []).forEach(
          ({ definitions, examples, thesaurusLinks, subsenses }) => {
            const thesaurasSenseIds = mapThesaurasSenseIds(
              thesaurusLinks,
              subsenses
            );
            const example = getFirstItemFromArray(examples)
              .map(e => e.text)
              .getOrElse("");
            (definitions || []).forEach(definition => {
              mappedResult.push({
                word,
                lexicalCategory: lexicalCategory.text,
                definition,
                synonyms: [],
                example,
                thesaurasSenseIds
              });
            });
          }
        );
      });
    });
  });
  return mappedResult;
}

// TODO: consider refactoring this and breaking out
// new functions for each individual responsibility
function mapEntriesToSynonyms(
  dictionaryResults: DictionaryResultWithThesaurasSenseIds[],
  response: Oxford.ThesaurasResponse
): DictionaryResult[] {
  return dictionaryResults.map(({ thesaurasSenseIds, ...definition }) => {
    let synonyms: string[] = [];
    (response.results || []).forEach(({ lexicalEntries }) => {
      (lexicalEntries || []).forEach(({ entries }) => {
        (entries || []).forEach(({ senses }) => {
          (thesaurasSenseIds || []).forEach(thesaurasId => {
            const sense = senses.find(({ id }) => id === thesaurasId);
            if (sense && sense.synonyms) {
              synonyms = [...synonyms, ...sense.synonyms.map(s => s.text)];
            }
          });
        });
      });
    });
    return { ...definition, synonyms };
  });
}

function mapThesaurasSenseIds(
  thesaurusLinks: Oxford.EntryThesaurasLink[] = [],
  senses: Oxford.EntrySense[] = []
): string[] {
  return thesaurusLinks.map(getLinkId).concat(
    senses
      .filter(({ thesaurusLinks }) => !!thesaurusLinks)
      .map(({ thesaurusLinks }) => thesaurusLinks.map(getLinkId))
      .reduce(flatten, [])
  );
}

function getWordIdFromLemmasResponse(
  response: Oxford.LemmasResponse
): Option<string> {
  return getFirstItemFromArray(response.results)
    .flatMap(lemma => getFirstItemFromArray(lemma.lexicalEntries))
    .flatMap(entry => getFirstItemFromArray(entry.inflectionOf))
    .map(inflection => inflection.id);
}

function getLinkId(link: Oxford.EntryThesaurasLink) {
  return link.sense_id;
}

function flatten<A>(prev: A[], curr: A[]): A[] {
  return [...prev, ...curr];
}

function getFirstItemFromArray<A>(arr: A[]): Option<A> {
  return arr && arr.length > 0 ? Some(arr[0]) : None;
}

export default routes;
