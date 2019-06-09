import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { spacing, size } from "../theming/symbols";
import Fuse from "fuse.js";
import {
  isRightHotKey,
  isLeftHotKey,
  isEnterHotKey
} from "../utilities/editor";
import { NoResults } from "./no-results";

const Wrap = styled.div`
  width: 100%;
  max-height: ${size.emojiMenuMaxHeight};
`;

const ListInner = styled.div`
  margin: -${spacing._0_125};
`;

const EmojiItem = styled.div`
  display: inline-block;
  margin: ${spacing._0_125};
  cursor: pointer;
  opacity: ${props => (props.isFocused ? 1 : 0.4)};
  transition: all 333ms ease;
`;

export function TagsList({
  search,
  tags,
  onTagSelected
}: {
  search: string;
  tags: string[];
  onTagSelected: (tag: string) => any;
}) {
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const fuzzy = new Fuse(tags, {
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 2,
      maxPatternLength: 32,
      minMatchCharLength: 1
    });
    // NB: for hashtags, need to include the #
    const searchCriteria = `#${search}`;
    setFocusedIndex(0);
    setFilteredTags(
      search.length > 0 ? fuzzy.search(searchCriteria).map(i => tags[i]) : tags
    );
  }, [search, tags]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isRightHotKey(event)) {
        setFocusedIndex(
          focusedIndex === filteredTags.length - 1 ? 0 : focusedIndex + 1
        );
      } else if (isLeftHotKey(event)) {
        setFocusedIndex(
          focusedIndex === 0 ? filteredTags.length - 1 : focusedIndex - 1
        );
      } else if (isEnterHotKey(event) && focusedIndex >= 0) {
        onTagSelected(filteredTags[focusedIndex]);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return function() {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredTags, focusedIndex, onTagSelected]);

  return (
    <Wrap>
      {filteredTags.length > 0 ? (
        <ListInner>
          {filteredTags.map((tag, i) => (
            <EmojiItem
              key={tag}
              isFocused={search.length === 0 || focusedIndex === i}
              onClick={(e: Event) => {
                e.preventDefault();
                onTagSelected(tag);
              }}
            >
              {tag}
            </EmojiItem>
          ))}
        </ListInner>
      ) : (
        <NoResults emojis="🔎 😒" message={`No tags found for "${search}"`} />
      )}
    </Wrap>
  );
}
