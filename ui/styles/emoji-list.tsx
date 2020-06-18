import React, { useState, useEffect } from "react";
import { emojis, Emoji } from "../utilities/emojis";
import styled from "styled-components";
import { spacing, size, font } from "../theming/symbols";
import Fuse from "fuse.js";
import { NoResults } from "./no-results";
import isHotkey from "is-hotkey";

export const EmojiList: React.FunctionComponent<{
  onEmojiSelected: (emoji: Emoji, searchText: string) => any;
  search: string;
}> = ({ search, onEmojiSelected }) => {
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    setFocusedIndex(0);
    setFilteredEmojis(
      search.length > 0 ? fuzzy.search(search).map((i) => i.item) : emojis
    );
  }, [search]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isHotkey("right", event)) {
        setFocusedIndex(
          focusedIndex === filteredEmojis.length - 1 ? 0 : focusedIndex + 1
        );
        return;
      }
      if (isHotkey("left", event)) {
        setFocusedIndex(
          focusedIndex === 0 ? filteredEmojis.length - 1 : focusedIndex - 1
        );
        return;
      }
      if (isHotkey("enter", event) && focusedIndex >= 0) {
        const emoji = filteredEmojis[focusedIndex];
        if (emoji) {
          onEmojiSelected(emoji, `:${search}`);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
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
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
};

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
  opacity: ${(props) => (props.isFocused ? 1 : 0.5)};
  transform: ${(props) =>
    props.isFocused ? "scale(1, 1)" : "scale(0.8, 0.8)"};
  transition: all 200ms ease;
  font-size: ${font._24.size};
  line-height: ${font._24.lineHeight};
`;

const fuzzy = new Fuse(emojis, {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 2,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name", "keywords"],
});
