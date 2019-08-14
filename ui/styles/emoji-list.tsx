import React, { useState, useEffect } from "react";
import { emojis, Emoji } from "../utilities/emojis";
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

const EmojiItem = styled.div<{ isFocused: boolean }>`
  display: inline-block;
  margin: ${spacing._0_125};
  cursor: pointer;
  opacity: ${props => (props.isFocused ? 1 : 0.5)};
  transform: ${props => (props.isFocused ? "scale(1, 1)" : "scale(0.8, 0.8)")};
  transition: all 200ms ease;
`;

const fuzzy = new Fuse(emojis, {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 2,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name", "keywords"]
});

export function EmojiList({
  search,
  onEmojiSelected
}: {
  onEmojiSelected: (emoji: Emoji, searchText: string) => any;
  search: string;
}) {
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    setFocusedIndex(0);
    setFilteredEmojis(search.length > 0 ? fuzzy.search(search) : emojis);
  }, [search]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isRightHotKey(event)) {
        setFocusedIndex(
          focusedIndex === filteredEmojis.length - 1 ? 0 : focusedIndex + 1
        );
      } else if (isLeftHotKey(event)) {
        setFocusedIndex(
          focusedIndex === 0 ? filteredEmojis.length - 1 : focusedIndex - 1
        );
      } else if (isEnterHotKey(event) && focusedIndex >= 0) {
        onEmojiSelected(filteredEmojis[focusedIndex], `:${search}`);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return function() {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredEmojis, focusedIndex, onEmojiSelected, search]);

  return (
    <Wrap>
      {filteredEmojis.length > 0 ? (
        <ListInner>
          {filteredEmojis.map((emoji, i) => (
            <EmojiItem
              key={emoji.codes}
              isFocused={search.length === 0 || focusedIndex === i}
              onMouseEnter={() => setFocusedIndex(i)}
              onClick={e => {
                e.preventDefault();
                onEmojiSelected(emoji, `:${search}`);
              }}
            >
              {emoji.char}
            </EmojiItem>
          ))}
        </ListInner>
      ) : (
        <NoResults emojis="🔎 😒" message={`No emojis found for "${search}"`} />
      )}
    </Wrap>
  );
}
