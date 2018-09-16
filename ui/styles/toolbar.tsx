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
  position: sticky;
  bottom: 0;
  background: ${color.cinder};
  border-top: solid 1px black;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

export function Toolbar() {
  return (
    <ToolbarWrapper>
      <>
        <Flex>
          <ToolbarBlock>Words: 3202</ToolbarBlock>
        </Flex>
        <Saving saving={true} />
      </>
    </ToolbarWrapper>
  );
}
