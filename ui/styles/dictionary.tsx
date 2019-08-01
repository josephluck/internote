import { styled } from "../theming/styled";
import { HeadingTwo, GhostHeadingTwo, BaseGhostElement } from "./typography";
import { spacing, font } from "../theming/symbols";
import { NoResults } from "./no-results";
import { Tag } from "./tag";
import { DictionaryResult } from "@internote/dictionary-service/types";

const DictionaryHeadingWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const DictionaryWordHeading = styled(HeadingTwo)`
  line-height: 1;
  margin: ${spacing._0_75} ${spacing._0_25} 0 0;
  font-style: italic;
`;

const GhostWordHeading = styled(GhostHeadingTwo)`
  margin: ${spacing._0_75} 0;
`;

const DictionaryType = styled.p`
  color: ${props => props.theme.dictionaryDescriptionText};
  font-size: ${font._12.size};
  line-height: ${font._12.size};
  margin: 0;
  font-style: italic;
`;

const DictionaryDescription = styled.p`
  color: ${props => props.theme.dictionaryDescriptionText};
  margin: ${spacing._0_5} 0;
`;

const GhostDescriptionWrapper = styled.div`
  margin: ${spacing._1} 0;
`;

const GhostDescription = styled(BaseGhostElement)`
  width: 250px;
  margin-bottom: ${spacing._0_125};
  height: ${spacing._0_75};
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const ThesaurusWrapper = styled.div`
  margin-bottom: ${spacing._1_5};
  &:last-of-type {
    margin-bottom: ${spacing._0_5};
  }
`;

const GhostThesaurusWord = styled(BaseGhostElement)`
  display: inline-block;
  height: ${font._12.size};
  padding: ${spacing._0_25};
  box-sizing: content-box;
  margin-right: ${spacing._0_125};
`;

const DictionaryEntryWrapper = styled.div`
  margin-bottom: ${spacing._1};
  &:last-of-type {
    margin-bottom: 0;
  }
`;

function DictionaryEntry({ result }: { result: DictionaryResult }) {
  return (
    <DictionaryEntryWrapper>
      <DictionaryHeadingWrapper>
        <DictionaryWordHeading>{result.word}</DictionaryWordHeading>
        <DictionaryType>{result.lexicalCategory.toLowerCase()}</DictionaryType>
      </DictionaryHeadingWrapper>
      <DictionaryDescription>{result.definition}</DictionaryDescription>
      {result.synonyms.length ? (
        <ThesaurusWrapper>
          {result.synonyms.map(synonym => (
            <Tag key={synonym} isFocused>
              {synonym}
            </Tag>
          ))}
        </ThesaurusWrapper>
      ) : null}
    </DictionaryEntryWrapper>
  );
}

export function Dictionary({
  isLoading = false,
  results,
  requestedWord
}: {
  isLoading?: boolean;
  results: DictionaryResult[];
  requestedWord: string;
}) {
  if (isLoading) {
    return (
      <div style={{ width: "100%" }}>
        <GhostWordHeading />
        <GhostDescriptionWrapper>
          <GhostDescription style={{ width: "430px" }} />
          <GhostDescription style={{ width: "480px" }} />
          <GhostDescription style={{ width: "460px" }} />
          <GhostDescription style={{ width: "280px" }} />
        </GhostDescriptionWrapper>

        <ThesaurusWrapper>
          <GhostThesaurusWord style={{ width: "30px" }} />
          <GhostThesaurusWord style={{ width: "40px" }} />
          <GhostThesaurusWord style={{ width: "24px" }} />
          <GhostThesaurusWord style={{ width: "34px" }} />
          <GhostThesaurusWord style={{ width: "43px" }} />
        </ThesaurusWrapper>
      </div>
    );
  }
  return (
    <div style={{ width: "100%" }}>
      {results.length > 0 ? (
        results.map(result => {
          return <DictionaryEntry result={result} key={result.word} />;
        })
      ) : (
        <NoResults
          emojis="📖 🤔"
          message={`We couldn't find "${requestedWord}" in the dictionary`}
        />
      )}
    </div>
  );
}
