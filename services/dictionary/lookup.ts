import HttpError from "http-errors";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import {
  encodeResponse,
  validateRequestBody,
  jsonErrorHandler,
} from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { CreateHandler } from "@internote/lib/types";
import {
  LookupRequestBody,
  LookupResponseBody,
  Oxford,
  DictionaryResult,
} from "./types";
import { required, isString, isSingleWord } from "@internote/lib/validator";
import Axios from "axios";
import { Option, Some, None } from "space-lift";

const api = Axios.create({
  baseURL: "https://od-api.oxforddictionaries.com:443/api/v2",
  headers: {
    app_id: process.env.OXFORD_API_ID,
    app_key: process.env.OXFORD_API_KEY,
  },
});

const validator = validateRequestBody<LookupRequestBody>({
  word: [required, isString, isSingleWord],
});

const lookup: CreateHandler<LookupRequestBody> = async (
  event,
  _ctx,
  callback
) => {
  const { word } = event.body;
  try {
    const lemmas = await api
      .get(`/lemmas/en/${word.toLowerCase()}`)
      .catch(() => {
        throw new HttpError.NotFound("Was not able to find lemma for word");
      });

    return getWordIdFromLemmasResponse(lemmas.data).fold(
      () => {
        throw new HttpError.NotFound("Lemmas request failed");
      },
      async (wordId) => {
        const entriesResponse = await api
          .get(`/entries/en-gb/${wordId}?strictMatch=false`)
          .catch(() => {
            throw new HttpError.NotFound("Entries request failed");
          });

        const entries = convertOxfordEntriesResponse(entriesResponse.data);

        function returnOnlyDictionaryEntries() {
          const response: LookupResponseBody = {
            results: entries.map(({ thesaurusSenseIds, ...rest }) => rest),
          };
          return callback(null, success(response));
        }

        try {
          // NB: we don't want to throw thesaurus
          const thesaurusResponse = await api.get(
            `/thesaurus/en/${wordId}?strictMatch=false`
          );

          if (thesaurusResponse.data) {
            const results = mapEntriesToSynonyms(
              entries,
              thesaurusResponse.data
            );
            const response: LookupResponseBody = {
              results,
            };
            return callback(null, success(response));
          } else {
            console.log("thesaurus was empty", { wordId });
          }
        } catch (err) {
          console.log("thesaurus was empty", err);
          return returnOnlyDictionaryEntries();
        }
      }
    );
  } catch (err) {
    throw new HttpError.InternalServerError(err);
  }
};

export const handler = middy(lookup)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());

interface DictionaryResultWithThesaurusSenseIds extends DictionaryResult {
  thesaurusSenseIds: string[];
}

// TODO: refactor this to split out functions for mapping
// data. Maybe use reduce & flatten combinations
function convertOxfordEntriesResponse(
  response: Oxford.EntriesResponse
): DictionaryResultWithThesaurusSenseIds[] {
  const mappedResult = [] as DictionaryResultWithThesaurusSenseIds[];
  (response.results || []).forEach(({ word, lexicalEntries }) => {
    (lexicalEntries || []).forEach(({ entries, lexicalCategory }) => {
      (entries || []).forEach(({ senses }) => {
        (senses || []).forEach(
          ({ definitions, examples, thesaurusLinks, subsenses }) => {
            const thesaurusSenseIds = mapThesaurusSenseIds(
              thesaurusLinks,
              subsenses
            );
            const example = getFirstItemFromArray(examples)
              .map((e) => e.text)
              .getOrElse("");
            (definitions || []).forEach((definition) => {
              mappedResult.push({
                word,
                lexicalCategory: lexicalCategory.text,
                definition,
                synonyms: [],
                example,
                thesaurusSenseIds,
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
  dictionaryResults: DictionaryResultWithThesaurusSenseIds[],
  response: Oxford.thesaurusResponse
): DictionaryResult[] {
  return dictionaryResults.map(({ thesaurusSenseIds, ...definition }) => {
    let synonyms: string[] = [];
    (response.results || []).forEach(({ lexicalEntries }) => {
      (lexicalEntries || []).forEach(({ entries }) => {
        (entries || []).forEach(({ senses }) => {
          (thesaurusSenseIds || []).forEach((thesaurusId) => {
            const sense = senses.find(({ id }) => id === thesaurusId);
            if (sense && sense.synonyms) {
              synonyms = [...synonyms, ...sense.synonyms.map((s) => s.text)];
            }
          });
        });
      });
    });
    return { ...definition, synonyms };
  });
}

function mapThesaurusSenseIds(
  thesaurusLinks: Oxford.EntryThesaurusLink[] = [],
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
    .flatMap((lemma) => getFirstItemFromArray(lemma.lexicalEntries))
    .flatMap((entry) => getFirstItemFromArray(entry.inflectionOf))
    .map((inflection) => inflection.id);
}

function getLinkId(link: Oxford.EntryThesaurusLink) {
  return link.sense_id;
}

function flatten<A>(prev: A[], curr: A[]): A[] {
  return [...prev, ...curr];
}

function getFirstItemFromArray<A>(arr: A[]): Option<A> {
  return arr && arr.length > 0 ? Some(arr[0]) : None;
}
