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
    thesaurusLinks?: EntryThesaurasLink[];
  }

  export interface EntryThesaurasLink {
    entry_id: string;
    /**
     * Links to the sense_id inside the
     * thesauras response sense id
     */
    sense_id: string;
  }

  export interface EntrySenseExample {
    text: string;
  }

  export interface ThesaurasResponse {
    results: ThesaurasResult[];
  }

  export interface ThesaurasResult {
    id: string;
    language: string;
    lexicalEntries: ThesaurasLexicalEntry[];
    type: string;
    word: string;
  }

  export interface ThesaurasLexicalEntry {
    entries: ThesaurasLexicalEntriesEntry[];
    language: string;
    lexicalCategory: LexicalCategory;
    text: string;
    variantForms?: ThesaurasVariantForm[];
  }

  export interface ThesaurasLexicalEntriesEntry {
    homographNumber?: string;
    senses: ThesaurasSense[];
    variantForms?: ThesaurasVariantForm[];
  }

  export interface ThesaurasSense {
    antonyms?: ThesaurasAntonym[];
    domains?: ThesaurasDomain[];
    examples: ThesaurasSenseExample[];
    /**
     * Unique ID that is referenced inside
     * entry response's EntryThesaurasLink
     * sense_id property
     */
    id: string;
    regions?: LexicalCategory[];
    registers?: LexicalCategory[];
    synonyms: ThesaurasSynonym[];
    subsenses?: ThesaurasSense[];
  }

  export interface ThesaurasAntonym {
    domains?: LexicalCategory[];
    id: string;
    language: string;
    regions?: LexicalCategory[];
    registers?: LexicalCategory[];
    text: string;
  }

  export type ThesaurasSynonym = ThesaurasAntonym;

  export interface ThesaurasDomain {
    id: string;
    text: string;
  }

  export interface ThesaurasSenseExample {
    definition?: string[];
    domains?: LexicalCategory[];
    notes?: LexicalCategory[];
    regions?: LexicalCategory[];
    registers?: LexicalCategory[];
    senseIds?: string[];
    text: string;
  }

  export interface ThesaurasVariantForm {}

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
