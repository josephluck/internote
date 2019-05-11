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
    entries: EntryLexicalEntriesEntry[];
    language: string;
    lexicalCategory: LexicalCategory;
    text: string;
  }

  export interface LexicalCategory {
    id: string;
    text: string;
  }

  export interface EntryLexicalEntriesEntry {
    senses: EntrySense[];
  }

  export interface EntrySense {
    id: string;
    definitions: string[];
    examples?: EntrySenseExample[];
    subsenses?: EntrySense[];
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
    variantForms: ThesaurasVariantForm[];
  }

  export interface ThesaurasLexicalEntriesEntry {
    homographNumber: string;
    senses: ThesaurasSense[];
    variantForms: ThesaurasVariantForm[];
  }

  export interface ThesaurasSense {
    antonyms: ThesaurasAntonym[];
    domains: ThesaurasDomain[];
    examples: ThesaurasSenseExample[];
    id: string;
    regions: LexicalCategory[];
    registers: LexicalCategory[];
    synonym: ThesaurasSynonym;
  }

  export interface ThesaurasAntonym {
    domains: LexicalCategory[];
    id: string;
    language: string;
    regions: LexicalCategory[];
    registers: LexicalCategory[];
    text: string;
  }

  export type ThesaurasSynonym = ThesaurasAntonym;

  export interface ThesaurasDomain {
    id: string;
    text: string;
  }

  export interface ThesaurasSenseExample {
    definition: string[];
    domains: LexicalCategory[];
    notes: LexicalCategory[];
    regions: LexicalCategory[];
    registers: LexicalCategory[];
    senseIds: string[];
    text: string;
  }

  export interface ThesaurasVariantForm {}
}
