import { emojis, Emoji } from "../utilities/emojis";
import styled from "styled-components";
import { spacing, size } from "../theming/symbols";

const Wrap = styled.div`
  width: 100%;
  max-height: ${size.emojiMenuMaxHeight};
  margin: -${spacing._0_125};
`;

const EmojiItem = styled.div`
  display: inline-block;
  margin: ${spacing._0_125};
  cursor: pointer;
`;

export function EmojiList({
  onEmojiSelected
}: {
  onEmojiSelected: (emoji: Emoji) => any;
}) {
  return (
    <Wrap>
      {emojis.map(emoji => (
        <EmojiItem
          key={emoji.codes}
          onClick={(e: Event) => {
            e.preventDefault();
            onEmojiSelected(emoji);
          }}
        >
          {emoji.char}
        </EmojiItem>
      ))}
    </Wrap>
  );
}
