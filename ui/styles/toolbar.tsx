import * as React from "react";
import { spacing, color, font } from "./theme";
import styled from "styled-components";
import { Saving } from "./saving";
import { ToolbarBlock } from "./toolbar-block";
import { Flex } from "grid-styled";

const ToolbarWrapper = styled.div`
  padding: ${spacing._0_5} ${spacing._2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${color.cinder};
  border-top: solid 1px black;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

export function Toolbar({ words, saving }: { words: number; saving: boolean }) {
  const minutes = wordsToReadingMinutes(words);
  return (
    <ToolbarWrapper>
      <>
        <Flex>
          <ToolbarBlock>Words: {words}</ToolbarBlock>
          <ToolbarBlock>
            Reading time: {minutes} {minutes > 1 ? "minutes" : "minute"}
          </ToolbarBlock>
        </Flex>
        <Saving saving={saving} />
      </>
    </ToolbarWrapper>
  );
}

function wordsToReadingMinutes(words: number): number {
  return Math.round(words / 200);
}
