import * as React from "react";
import { spacing, color, font } from "./theme";
import styled from "styled-components";
import { Saving } from "./saving";
import { ToolbarBlock } from "./toolbar-block";
import { Flex } from "grid-styled";
import { DeleteForever } from "styled-icons/material";
import { Wrapper } from "./wrapper";

const ToolbarWrapper = styled.div`
  padding-top: ${spacing._0_5};
  padding-bottom: ${spacing._0_5};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${color.cinder};
  border-top: solid 1px black;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

const ToolbarInner = Wrapper.extend`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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
      <ToolbarInner>
        <Flex flex="1">
          <ToolbarBlock>
            {words} words ({minutes} {minutes === 1 ? "min" : "mins"})
          </ToolbarBlock>
        </Flex>
        <Flex alignItems="center">
          <Flex mr={spacing._0_5}>
            <DeleteForever
              width="16"
              height="16"
              fill={color.jumbo}
              onClick={onDelete}
              style={{ cursor: "pointer" }}
            />
          </Flex>
          <Flex>
            <Saving saving={saving} />
          </Flex>
        </Flex>
      </ToolbarInner>
    </ToolbarWrapper>
  );
}

function wordsToReadingMinutes(words: number): number {
  return Math.round(words / 200);
}
