import { InternoteEditorElement } from "@internote/lib/editor-types";
import React, { useCallback } from "react";
import styled from "styled-components";

import { useTwineState } from "../store";
import { font, size, spacing } from "../theming/symbols";
import { OutlineElement } from "./editor/types";
import {
  extractAllTagElementsFromValue,
  extractOutlineFromValue,
} from "./editor/utils";
import { Tag } from "./tag";

export const Outline: React.FunctionComponent<{
  value: InternoteEditorElement[];
}> = ({ value }) => {
  const showing = useTwineState(
    (state) => state.preferences.outlineShowing || false
  );
  const headings = extractOutlineFromValue(value);
  const hashtags = extractAllTagElementsFromValue(value);

  const handleHeadingClick = useCallback((heading: OutlineElement) => {
    console.log("Focus", heading);
  }, []);

  return (
    <Wrap showing={showing}>
      {headings.map((heading) => (
        <OutlineItemWrapper
          key={heading.key}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleHeadingClick(heading);
          }}
        >
          {heading.type === "heading-one" ? (
            <OutlineHeadingOne>{heading.text}</OutlineHeadingOne>
          ) : (
            <OutlineHeadingTwo>{heading.text}</OutlineHeadingTwo>
          )}
        </OutlineItemWrapper>
      ))}
      <Spacer />
      <TagsWrapper>
        {hashtags.map((tag) => (
          <Tag key={tag.tag} isFocused={false}>
            {tag.tag}
          </Tag>
        ))}
      </TagsWrapper>
    </Wrap>
  );
};

const Wrap = styled.div<{ showing?: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  overflow: auto;
  width: ${size.outlineWidth};
  padding: ${spacing._3} ${spacing._1} ${spacing._3} 0;
  text-align: right;
  transition: all 333ms ease;
  opacity: ${(props) => (props.showing ? 0.2 : 0)};
  pointer-events: ${(props) => (props.showing ? "normal" : "none")};
  &:hover {
    opacity: 1;
  }
`;

const OutlineItemWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const OutlineHeadingOne = styled.p`
  margin: ${spacing._1} 0 ${spacing._0_25};
  font-weight: bold;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OutlineHeadingTwo = styled.p`
  margin: ${spacing._0_125} 0;
  opacity: 0.7;
  font-weight: 500;
  font-size: ${font._16.size};
  line-height: ${font._16.lineHeight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Spacer = styled.div`
  margin: ${spacing._0_5} 0;
`;

const TagsWrapper = styled.div`
  margin: -${spacing._0_125};
`;
