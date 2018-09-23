import * as React from "react";
import { spacing, color, font } from "./theme";
import styled from "styled-components";
import { Saving } from "./saving";
import { ToolbarBlock } from "./toolbar-block";
import { Flex, Box } from "grid-styled";
import { DeleteForever } from "styled-icons/material";

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

export function Toolbar({
  words,
  saving,
  onDelete
}: {
  words: number;
  saving: boolean;
  onDelete: () => void;
}) {
  const minutes = wordsToReadingMinutes(words);
  return (
    <ToolbarWrapper>
      <>
        <Flex flex="1">
          <ToolbarBlock>Words: {words}</ToolbarBlock>
          <ToolbarBlock>
            Reading time: {minutes} {minutes > 1 ? "minutes" : "minute"}
          </ToolbarBlock>
        </Flex>
        <Flex alignItems="center">
          <Flex mr={spacing._0_5}>
            <DeleteForever
              width="16"
              height="16"
              fill={color.jumbo}
              onClick={onDelete}
            />
          </Flex>
          <Flex>
            <Saving saving={saving} />
          </Flex>
        </Flex>
      </>
    </ToolbarWrapper>
  );
}

function wordsToReadingMinutes(words: number): number {
  return Math.round(words / 200);
}
