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
import { font, spacing, borderRadius } from "../theming/symbols";
import { Flex } from "@rebass/grid";

const PlaybackWrapper = styled.div<{ forceShow: boolean }>`
  display: inline-flex;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  border-radius: ${borderRadius._6};
  padding: ${spacing._0_25};
  color: ${props =>
    props.forceShow
      ? props.theme.expandingIconButtonActiveText
      : props.theme.expandingIconButtonInactiveText};
  background: ${props =>
    props.forceShow
      ? props.theme.expandingIconButtonBackground
      : "transparent"};
  &:hover {
    color: ${props => props.theme.expandingIconButtonActiveText};
    background: ${props => props.theme.expandingIconButtonBackground};
  }
`;

const IconWrap = styled.div`
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

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
                    <IconWrap onClick={this.props.onDiscardSpeech}>
                      <FontAwesomeIcon icon={faTimes} />
                    </IconWrap>
                  </Flex>
                ) : this.props.isSpeechLoading ? (
                  "Hold up!"
                ) : (
                  "Talk"
                )}
              </CollapsedWrapper>
            }
          >
            {collapse => (
              <PlaybackWrapper forceShow={!!this.props.speechSrc}>
                <IconWrap onClick={() => this.onIconClick(audio)}>
                  {this.renderIcon(audio)}
                </IconWrap>
                {collapse.renderCollapsedContent()}
              </PlaybackWrapper>
            )}
          </CollapseWidthOnHover>
        )}
      </AudioPlayer>
    );
  }
}
