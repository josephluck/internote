export interface LookupRequestBody {
  /**
   * The word to look up
   */
  word: string;
}

export interface LookupResponseBody {
  results: DictionaryResult[];
}

export interface DictionaryResult {
  /**
   * The word that was looked up
   */
  word: string;
  /**
   * The type of word (noun, verb etc)
   */
  lexicalCategory: string;
  /**
   * The definition of the looked up word
   */
  definition: string;
  /**
   * An example of the words use inside a sentence
   */
  example: string;
  /**
   * Some synonyms for the looked up word
   */
  synonyms: string[];
}

export namespace Oxford {
  export interface EntriesResponse {
    id: string;
    metadata: any;
    results: EntryResult[];
    word: string;
  }

  export interface EntryResult {
    id: string;
    language: string;
    lexicalEntries: EntryLexicalEntry[];
    type: string;
    word: string;
  }

  export interface EntryLexicalEntry {
    derivatives?: LexicalCategory[];
    entries: EntryLexicalEntriesEntry[];
    language: string;
    lexicalCategory: LexicalCategory;
    pronunciations?: Pronunciation[];
    text: string;
  }

  export interface Pronunciation {
    audioFile: string;
    dialects: string[];
    phoneticNotation: string;
    phoneticSpelling: string;
  }

  export interface LexicalCategory {
    id: string;
    text: string;
  }

  export interface EntryLexicalEntriesEntry {
    etymologies?: string[];
    senses: EntrySense[];
  }

  export interface EntrySense {
    id: string;
    definitions: string[];
    shortDefinitions?: string[];
    examples?: EntrySenseExample[];
    subsenses?: EntrySense[];
    thesaurusLinks?: EntryThesaurusLink[];
  }

  export interface EntryThesaurusLink {
    entry_id: string;
    /**
     * Links to the sense_id inside the
     * thesaurus response sense id
     */
    sense_id: string;
  }

  export interface EntrySenseExample {
    text: string;
  }

  export interface thesaurusResponse {
    results: thesaurusResult[];
  }

  export interface thesaurusResult {
    id: string;
    language: string;
    lexicalEntries: thesaurusLexicalEntry[];
    type: string;
    word: string;
  }

  export interface thesaurusLexicalEntry {
    entries: thesaurusLexicalEntriesEntry[];
    language: string;
    lexicalCategory: LexicalCategory;
    text: string;
    variantForms?: thesaurusVariantForm[];
  }

  export interface thesaurusLexicalEntriesEntry {
    homographNumber?: string;
    senses: thesaurusSense[];
    variantForms?: thesaurusVariantForm[];
  }

  export interface thesaurusSense {
    antonyms?: thesaurusAntonym[];
    domains?: thesaurusDomain[];
    examples: thesaurusSenseExample[];
    /**
     * Unique ID that is referenced inside
     * entry response's EntryThesaurusLink
     * sense_id property
     */
    id: string;
    regions?: LexicalCategory[];
    registers?: LexicalCategory[];
    synonyms: thesaurusSynonym[];
    subsenses?: thesaurusSense[];
  }

  export interface thesaurusAntonym {
    domains?: LexicalCategory[];
    id: string;
    language: string;
    regions?: LexicalCategory[];
    registers?: LexicalCategory[];
    text: string;
  }

  export type thesaurusSynonym = thesaurusAntonym;

  export interface thesaurusDomain {
    id: string;
    text: string;
  }

  export interface thesaurusSenseExample {
    definition?: string[];
    domains?: LexicalCategory[];
    notes?: LexicalCategory[];
    regions?: LexicalCategory[];
    registers?: LexicalCategory[];
    senseIds?: string[];
    text: string;
  }

  export interface thesaurusVariantForm {}

  export interface LemmasResponse {
    results: Lemma[];
  }

  export interface Lemma {
    id: string;
    language: string;
    lexicalEntries: LemmaLexicalEntry[];
  }

  export interface LemmaLexicalEntry {
    inflectionOf: LemmaInflection[];
    language: string;
    lexicalCategory: LexicalCategory;
    text: string;
  }

  export interface LemmaInflection {
    id: string;
    text: string;
  }
}
