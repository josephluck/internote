import React from "react";
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

const EmojiItem = styled.div`
  display: inline-block;
  margin: ${spacing._0_125};
  cursor: pointer;
  opacity: ${props => (props.isFocused ? 1 : 0.4)};
  transition: all 333ms ease;
`;

interface Props {
  onEmojiSelected: (emoji: Emoji) => any;
  search: string;
}

interface State {
  emojis: Emoji[];
  focusedIndex: number;
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
      emojis,
      focusedIndex: -1
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  componentWillReceiveProps(prevProps: Props) {
    if (this.props.search.length === 0) {
      this.setState({ emojis });
    } else if (prevProps.search !== this.props.search) {
      this.searchEmojis();
    }
  }

  searchEmojis = () => {
    const searchedEmojis =
      this.props.search.length > 0 ? fuzzy.search(this.props.search) : emojis;
    this.setState({
      emojis: searchedEmojis,
      focusedIndex: 0
    });
  };

  onKeyDown = (event: Event) => {
    if (isRightHotKey(event)) {
      this.setState({
        focusedIndex:
          this.state.focusedIndex === this.state.emojis.length - 1
            ? 0
            : this.state.focusedIndex + 1
      });
    } else if (isLeftHotKey(event)) {
      this.setState({
        focusedIndex:
          this.state.focusedIndex === 0
            ? this.state.emojis.length - 1
            : this.state.focusedIndex - 1
      });
    } else if (isEnterHotKey(event) && this.state.focusedIndex >= 0) {
      this.props.onEmojiSelected(this.state.emojis[this.state.focusedIndex]);
    }
  };

  render() {
    return (
      <Wrap>
        {this.state.emojis.length > 0 ? (
          <ListInner>
            {this.state.emojis.map((emoji, i) => (
              <EmojiItem
                key={emoji.codes}
                isFocused={
                  this.props.search.length === 0 ||
                  this.state.focusedIndex === i
                }
                onClick={(e: Event) => {
                  e.preventDefault();
                  this.props.onEmojiSelected(emoji);
                }}
              >
                {emoji.char}
              </EmojiItem>
            ))}
          </ListInner>
        ) : (
          <NoResults
            emojis="🔎 😒"
            message={`No emojis found for "${this.props.search}"`}
          />
        )}
      </Wrap>
    );
  }
}
