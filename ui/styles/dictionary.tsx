import * as Types from "@internote/api/domains/types";
import { styled } from "../theming/styled";
import { HeadingTwo, GhostHeadingTwo, BaseGhostElement } from "./typography";
import { spacing, font, borderRadius } from "../theming/symbols";
import { DropdownMenuSpacer } from "./dropdown-menu";

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
  width: 160px;
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

const ThesaurasWrapper = styled.div`
  display: flex;
  margin-bottom: ${spacing._0_75};
`;

const ThesaurasWord = styled.div`
  margin-right: ${spacing._0_125};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  border-radius: ${borderRadius._6};
  padding: ${spacing._0_25};
  color: ${props => props.theme.thesaurasWordText};
  background: ${props => props.theme.thesaurasWordBackground};
  transition: all 300ms ease;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.thesaurasWordActiveText};
  }
`;

const GhostThesaurasWord = styled(BaseGhostElement)`
  height: ${font._12.size};
  padding: ${spacing._0_25};
  box-sizing: content-box;
  margin-right: ${spacing._0_125};
`;

const DictionaryEntryWrapper = styled.div`
  margin-bottom: ${spacing._1};
  &:last-of-type {
    margin-bottom: 0;
    border-bottom: 0;
  }
`;

function DictionaryEntry({ result }: { result: Types.DictionaryResult }) {
  return (
    <DictionaryEntryWrapper>
      <DictionaryHeadingWrapper>
        <DictionaryWordHeading>{result.word}</DictionaryWordHeading>
        <DictionaryType>{result.lexicalCategory}</DictionaryType>
      </DictionaryHeadingWrapper>
      <DictionaryDescription>{result.definition}</DictionaryDescription>
      <ThesaurasWrapper>
        {result.synonyms.map(synonym => (
          <ThesaurasWord>{synonym}</ThesaurasWord>
        ))}
      </ThesaurasWrapper>
    </DictionaryEntryWrapper>
  );
}

export function Dictionary({
  isLoading = false,
  results
}: {
  isLoading?: boolean;
  results: Types.DictionaryResult[];
}) {
  if (isLoading) {
    return (
      <div>
        <GhostWordHeading />
        <GhostDescriptionWrapper>
          <GhostDescription style={{ width: "430px" }} />
          <GhostDescription style={{ width: "480px" }} />
          <GhostDescription style={{ width: "460px" }} />
          <GhostDescription style={{ width: "280px" }} />
        </GhostDescriptionWrapper>

        <ThesaurasWrapper>
          <GhostThesaurasWord style={{ width: "30px" }} />
          <GhostThesaurasWord style={{ width: "40px" }} />
          <GhostThesaurasWord style={{ width: "24px" }} />
          <GhostThesaurasWord style={{ width: "34px" }} />
          <GhostThesaurasWord style={{ width: "43px" }} />
        </ThesaurasWrapper>
      </div>
    );
  }
  return (
    <div>
      {results.map((result, i) => {
        return (
          <>
            {i > 0 ? <DropdownMenuSpacer /> : null}
            <DictionaryEntry result={result} key={result.word} />
          </>
        );
      })}
    </div>
  );
}
