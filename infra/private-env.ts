export interface Env {
  REGION: string;
  /** NB: Comes from Bonsai.io */
  /** TODO: put this in SSM */
  ELASTIC_SEARCH_DOMAIN: string;
  ELASTIC_SEARCH_ACCESS: string;
  ELASTIC_SEARCH_SECRET: string;
  COLLECTIONS_DYNAMO_ENDPOINT: string;
  COLLECTIONS_TABLE_NAME: string;
  COLLECTIONS_ELASTIC_SEARCH_INDEX: string;
  CARDS_DYNAMO_ENDPOINT: string;
  CARDS_TABLE_NAME: string;
  CARDS_ELASTIC_SEARCH_INDEX: string;
  TAGS_DYNAMO_ENDPOINT: string;
  TAG_GROUPS_DYNAMO_ENDPOINT: string;
  TAG_GROUPS_TABLE_NAME: string;
  TAGS_TABLE_NAME: string;
}

const defaultEnv: Env = {
  REGION: "eu-west-1",
  ELASTIC_SEARCH_DOMAIN:
    "https://6NSied2PoX:8UsF2iZpG4hK5HkyjDe@collect-8834260536.eu-west-1.bonsaisearch.net:443",
  ELASTIC_SEARCH_ACCESS: "6NSied2PoX",
  ELASTIC_SEARCH_SECRET: "8UsF2iZpG4hK5HkyjDe",
  COLLECTIONS_DYNAMO_ENDPOINT: "https://dynamodb.eu-west-1.amazonaws.com",
  COLLECTIONS_TABLE_NAME: "collections_table",
  COLLECTIONS_ELASTIC_SEARCH_INDEX: "collections",
  CARDS_DYNAMO_ENDPOINT: "https://dynamodb.eu-west-1.amazonaws.com",
  CARDS_TABLE_NAME: "cards_table",
  CARDS_ELASTIC_SEARCH_INDEX: "cards",
  TAGS_DYNAMO_ENDPOINT: "https://dynamodb.eu-west-1.amazonaws.com",
  TAG_GROUPS_DYNAMO_ENDPOINT: "https://dynamodb.eu-west-1.amazonaws.com",
  TAG_GROUPS_TABLE_NAME: "tag_groups_table",
  TAGS_TABLE_NAME: "tags_table"
};

export const env: Env = Object.keys(defaultEnv).reduce(
  (acc, key) => ({
    ...acc,
    [key]: process.env[key] || defaultEnv[key as keyof Env]
  }),
  defaultEnv
);
