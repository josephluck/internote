import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { spacing, size } from "../theming/symbols";
import Fuse from "fuse.js";
import {
  isRightHotKey,
  isLeftHotKey,
  isEnterHotKey
} from "../utilities/editor";
import { Tag, NewTag } from "./tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Wrap = styled.div`
  width: 100%;
  max-height: ${size.emojiMenuMaxHeight};
`;

const ListInner = styled.div`
  margin: -${spacing._0_125};
  padding: ${spacing._0_25} 0;
`;

const SavingIcon = styled.div`
  margin-right: ${spacing._0_25};
`;

export function TagsList({
  search,
  tags,
  onTagSelected,
  onCreateNewTag,
  newTagSaving
}: {
  search: string;
  tags: string[];
  onTagSelected: (tag: string) => any;
  onCreateNewTag: () => any;
  newTagSaving: boolean;
}) {
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(1);

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
    const newFilteredTags =
      search.length > 0 ? fuzzy.search(searchCriteria).map(i => tags[i]) : tags;
    setFocusedIndex(newFilteredTags.length > 0 ? 1 : 0);
    setFilteredTags(newFilteredTags);
  }, [search, tags.length]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // NB: start focused index for selected index is 1
      if (isRightHotKey(event)) {
        setFocusedIndex(
          focusedIndex === filteredTags.length ? 0 : focusedIndex + 1
        );
      } else if (isLeftHotKey(event)) {
        setFocusedIndex(
          focusedIndex === 0 ? filteredTags.length : focusedIndex - 1
        );
      } else if (isEnterHotKey(event) && focusedIndex >= 0) {
        // NB: focused index is 1 indexed for existing tags
        const focusedTag = filteredTags[focusedIndex - 1];
        if (focusedTag) {
          onTagSelected(focusedTag);
        } else {
          onCreateNewTag();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return function() {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredTags.length, focusedIndex]);

  return (
    <Wrap>
      <ListInner>
        <NewTag
          isFocused={focusedIndex === 0}
          onMouseEnter={() => setFocusedIndex(0)}
          onClick={(e: Event) => {
            e.preventDefault();
            onCreateNewTag();
          }}
        >
          {newTagSaving ? (
            <SavingIcon>
              {" "}
              <FontAwesomeIcon icon={faSpinner} spin />{" "}
            </SavingIcon>
          ) : null}
          Create #{search}
        </NewTag>
        {filteredTags.map((tag, i) => (
          <Tag
            key={tag}
            isFocused={search.length === 0 || focusedIndex === i + 1}
            onMouseEnter={() => setFocusedIndex(i + 1)}
            onClick={(e: Event) => {
              e.preventDefault();
              onTagSelected(tag);
            }}
          >
            {tag}
          </Tag>
        ))}
      </ListInner>
    </Wrap>
  );
}
