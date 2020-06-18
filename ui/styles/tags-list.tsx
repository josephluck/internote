import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { spacing, size } from "../theming/symbols";
import Fuse from "fuse.js";
import { Tag, NewTag } from "./tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import isHotkey from "is-hotkey";

export const TagsList: React.FunctionComponent<{
  search: string;
  tags: string[];
  onTagSelected: (tag: string, searchText: string) => any;
  onCreateNewTag: (searchText: string) => any;
  newTagSaving: boolean;
}> = ({ search, tags, onTagSelected, onCreateNewTag, newTagSaving }) => {
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(1);

  useEffect(() => {
    const fuzzy = new Fuse(tags, {
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 2,
      maxPatternLength: 32,
      minMatchCharLength: 1,
    });
    // NB: for hashtags, need to include the # to the search
    const searchCriteria = `#${search}`;
    const newFilteredTags =
      search.length > 0
        ? fuzzy.search(searchCriteria).map((i) => tags[i.refIndex])
        : tags;
    setFocusedIndex(newFilteredTags.length > 0 ? 1 : 0);
    setFilteredTags(newFilteredTags);
  }, [search, tags.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isHotkey("right", event)) {
        // NB: start focused index for selected index is 1 to compensate with create new tag being index 0
        setFocusedIndex(
          focusedIndex === filteredTags.length ? 0 : focusedIndex + 1
        );
        return;
      }

      if (isHotkey("left", event)) {
        setFocusedIndex(
          focusedIndex === 0 ? filteredTags.length : focusedIndex - 1
        );
        return;
      }

      const shouldEnterTag = isHotkey("enter", event) && focusedIndex >= 0;
      if (shouldEnterTag) {
        // NB: focused index is 1 indexed for existing tags to compensate with create new tag being index 0
        const focusedExistingTag = filteredTags[focusedIndex - 1];
        if (focusedExistingTag) {
          onTagSelected(focusedExistingTag, `#${search}`);
        } else {
          onCreateNewTag(`#${search}`);
        }
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredTags.length, focusedIndex, search]);

  return (
    <Wrap>
      <ListInner>
        <NewTag
          isFocused={focusedIndex === 0}
          onMouseEnter={() => setFocusedIndex(0)}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCreateNewTag(`#${search}`);
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
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTagSelected(tag, search);
            }}
          >
            {tag}
          </Tag>
        ))}
      </ListInner>
    </Wrap>
  );
};

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
