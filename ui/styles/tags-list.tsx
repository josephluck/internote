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
  onTagSelected: (tag: string, searchText: string) => any;
  onCreateNewTag: (searchText: string) => any;
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (isRightHotKey(event)) {
        // NB: start focused index for selected index is 1 to compensate with create new tag being index 0
        setFocusedIndex(
          focusedIndex === filteredTags.length ? 0 : focusedIndex + 1
        );
        return;
      }

      if (isLeftHotKey(event)) {
        setFocusedIndex(
          focusedIndex === 0 ? filteredTags.length : focusedIndex - 1
        );
        return;
      }

      const shouldEnterTag = isEnterHotKey(event) && focusedIndex >= 0;
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
          onClick={e => {
            e.preventDefault();
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
            onClick={e => {
              e.preventDefault();
              onTagSelected(tag, search);
            }}
          >
            {tag}
          </Tag>
        ))}
      </ListInner>
    </Wrap>
  );
}
