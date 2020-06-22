import { DictionaryResult } from "@internote/dictionary-service/types";
import React from "react";
import styled from "styled-components";

import { useTwineState } from "../store";
import { font, spacing } from "../theming/symbols";
import { NoResults } from "./no-results";
import { Tag } from "./tag";
import { BaseGhostElement, GhostHeadingTwo, HeadingTwo } from "./typography";

export const Dictionary: React.FunctionComponent<{
  selectedWord: string;
  isLoading: boolean;
}> = ({ selectedWord, isLoading }) => {
  const results = useTwineState((state) => state.dictionary.dictionaryResults);

  return isLoading ? (
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
  ) : (
    <div style={{ width: "100%" }}>
      {results.length > 0 ? (
        results.map((result) => (
          <DictionaryEntry result={result} key={result.word} />
        ))
      ) : (
        <NoResults
          emojis="📖 🤔"
          message={`We couldn't find "${selectedWord}" in the dictionary`}
        />
      )}
    </div>
  );
};

const DictionaryEntry: React.FunctionComponent<{
  result: DictionaryResult;
}> = ({ result }) => (
  <DictionaryEntryWrapper>
    <DictionaryHeadingWrapper>
      <DictionaryWordHeading>{result.word}</DictionaryWordHeading>
      <DictionaryType>{result.lexicalCategory.toLowerCase()}</DictionaryType>
    </DictionaryHeadingWrapper>
    <DictionaryDescription>{result.definition}</DictionaryDescription>
    {result.synonyms.length ? (
      <ThesaurusWrapper>
        {result.synonyms.map((synonym) => (
          <Tag key={synonym} isFocused>
            {synonym}
          </Tag>
        ))}
      </ThesaurusWrapper>
    ) : null}
  </DictionaryEntryWrapper>
);

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
  color: ${(props) => props.theme.dictionaryDescriptionText};
  font-size: ${font._12.size};
  line-height: ${font._12.size};
  margin: 0;
  font-style: italic;
`;

const DictionaryDescription = styled.p`
  color: ${(props) => props.theme.dictionaryDescriptionText};
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
