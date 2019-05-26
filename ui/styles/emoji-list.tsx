import React from "react";
import { emojis, Emoji } from "../utilities/emojis";
import styled from "styled-components";
import { spacing, size } from "../theming/symbols";
import Fuse from "fuse.js";

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

interface Props {
  onEmojiSelected: (emoji: Emoji) => any;
  search: string;
}

interface State {
  emojis: Emoji[];
}

const fuzzy = new Fuse(emojis, {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 2,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name", "keywords"]
});

export class EmojiList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      emojis
    };
  }

  componentWillReceiveProps(prevProps: Props) {
    if (prevProps.search !== this.props.search) {
      this.searchEmojis();
    }
  }

  searchEmojis = () => {
    this.setState({
      emojis:
        this.props.search.length > 0 ? fuzzy.search(this.props.search) : emojis
    });
  };

  render() {
    return (
      <Wrap>
        {this.state.emojis.map(emoji => (
          <EmojiItem
            key={emoji.codes}
            onClick={(e: Event) => {
              e.preventDefault();
              this.props.onEmojiSelected(emoji);
            }}
          >
            {emoji.char}
          </EmojiItem>
        ))}
      </Wrap>
    );
  }
}
