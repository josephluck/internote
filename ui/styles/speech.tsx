import React from "react";
import {
  faSpinner,
  faMicrophone,
  faTimes,
  faPlay,
  faPause
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { AudioRenderProps, AudioPlayer } from "./audio";
import { styled } from "../theming/styled";
import { spacing } from "../theming/symbols";
import { Flex } from "@rebass/grid";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";

const CollapsedWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${spacing._0_25};
  white-space: nowrap;
  font-weight: 600;
`;

const TimelineWrap = styled.div`
  width: 70px;
  border-radius: 9999px;
  background: ${props => props.theme.audioTimelineInactive};
  overflow: hidden;
  margin-right: ${spacing._0_25};
`;

const TimelineInner = styled.div`
  height: 6px;
  border-radius: 9999px;
  background: ${props => props.theme.audioTimelineActive};
  transition: width 333ms linear;
`;

interface Props {
  speechSrc: string;
  isSpeechLoading: boolean;
  onRequestSpeech: () => any;
  onDiscardSpeech: () => any;
}

interface State {}

export class Speech extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  onIconClick = (audioState: AudioRenderProps) => {
    if (this.props.isSpeechLoading || audioState.status === "loading") {
      return;
    } else if (!this.props.speechSrc) {
      return;
    } else if (audioState.status === "playing") {
      audioState.requestPause();
    } else if (
      audioState.status === "paused" ||
      audioState.status === "stopped"
    ) {
      audioState.requestPlay();
    }
  };

  renderIcon = (audioState: AudioRenderProps) => {
    if (this.props.isSpeechLoading || audioState.status === "loading") {
      return <FontAwesomeIcon icon={faSpinner} spin />;
    } else if (!this.props.speechSrc) {
      return <FontAwesomeIcon icon={faMicrophone} />;
    } else if (audioState.status === "playing") {
      return <FontAwesomeIcon icon={faPause} />;
    } else if (
      audioState.status === "paused" ||
      audioState.status === "stopped"
    ) {
      return <FontAwesomeIcon icon={faPlay} />;
    } else {
      return null;
    }
  };

  render() {
    return (
      <AudioPlayer src={this.props.speechSrc} autoPlay>
        {audio => (
          <CollapseWidthOnHover
            onClick={
              !this.props.speechSrc ? this.props.onRequestSpeech : undefined
            }
            forceShow={!!this.props.speechSrc || this.props.isSpeechLoading}
            collapsedContent={
              <CollapsedWrapper>
                {this.props.speechSrc ? (
                  <Flex alignItems="center">
                    <TimelineWrap>
                      <TimelineInner
                        style={{ width: `${audio.percentagePlayed}%` }}
                      />
                    </TimelineWrap>
                    <ToolbarExpandingButtonIconWrap
                      onClick={this.props.onDiscardSpeech}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </ToolbarExpandingButtonIconWrap>
                  </Flex>
                ) : this.props.isSpeechLoading ? (
                  "Loading"
                ) : (
                  "Speech"
                )}
              </CollapsedWrapper>
            }
          >
            {collapse => (
              <ToolbarExpandingButton forceShow={!!this.props.speechSrc}>
                <ToolbarExpandingButtonIconWrap
                  onClick={() => this.onIconClick(audio)}
                >
                  {this.renderIcon(audio)}
                </ToolbarExpandingButtonIconWrap>
                {collapse.renderCollapsedContent()}
              </ToolbarExpandingButton>
            )}
          </CollapseWidthOnHover>
        )}
      </AudioPlayer>
    );
  }
}
