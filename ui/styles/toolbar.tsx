import * as React from "react";
import { spacing, color, font, borderRadius } from "./theme";
import styled from "styled-components";
import { Saving } from "./saving";
import { ToolbarBlock } from "./toolbar-block";
import { Flex } from "grid-styled";
import { Wrapper } from "./wrapper";
import { Button } from "./button";

const ToolbarWrapper = Wrapper.extend`
  position: fixed;
  bottom: ${spacing._1};
  left: ${spacing._0};
  right: ${spacing._0};
  z-index: 5;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

const ToolbarInner = styled.div`
  padding: ${spacing._0_5} ${spacing._1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadius._6};
  background: ${color.black};
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
      <ToolbarInner>
        <Flex flex="1">
          <ToolbarBlock>
            {words} words ({minutes} {minutes === 1 ? "min" : "mins"})
          </ToolbarBlock>
        </Flex>
        <Flex alignItems="center">
          <Flex mr={spacing._0_5}>
            <Button small secondary onClick={onDelete}>
              Delete
            </Button>
            {/* <DeleteForever
              width="16"
              height="16"
              fill={color.jumbo}
              onClick={onDelete}
              style={{ cursor: "pointer" }}
            /> */}
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
