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
import { AudioState, defaultAudioState, AudioPlayer } from "./audio";
import { styled } from "../theming/styled";
import { font, spacing } from "../theming/symbols";
import { Flex } from "@rebass/grid";

const PlaybackWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
`;

const IconWrap = styled.div`
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
`;

const CollapsedWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${spacing._0_25};
  white-space: nowrap;
  font-weight: 600;
`;

const Timeline = styled.div`
  width: 50px;
  height: 3px;
  border-radius: 3px;
  background: blue;
  margin-right: ${spacing._0_25};
`;

interface Props {
  speechSrc: string;
  isSpeechLoading: boolean;
  onRequestSpeech: () => any;
  onDiscardSpeech: () => any;
}

interface State extends AudioState {}

export class Speech extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultAudioState
    };
  }

  syncAudioState = (audioState: AudioState) => {
    this.setState({ ...audioState });
  };

  renderIcon = (audioState: AudioState) => {
    if (this.props.isSpeechLoading || audioState.status === "loading") {
      return <FontAwesomeIcon icon={faSpinner} spin />;
    } else if (!this.props.speechSrc) {
      return <FontAwesomeIcon icon={faMicrophone} />;
    } else if (audioState.status === "playing") {
      return <FontAwesomeIcon icon={faPlay} />;
    } else if (
      audioState.status === "paused" ||
      audioState.status === "stopped"
    ) {
      return <FontAwesomeIcon icon={faPause} />;
    } else {
      return null;
    }
  };

  render() {
    return (
      <AudioPlayer src={this.props.speechSrc} autoPlay>
        {audio => (
          <CollapseWidthOnHover
            forceShow={!!this.props.speechSrc || this.props.isSpeechLoading}
            collapsedContent={
              <CollapsedWrapper>
                {this.props.speechSrc ? (
                  <Flex alignItems="center">
                    <Timeline />
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
              <PlaybackWrapper>
                <IconWrap>{this.renderIcon(audio)}</IconWrap>
                {collapse.renderCollapsedContent()}
              </PlaybackWrapper>
            )}
          </CollapseWidthOnHover>
        )}
      </AudioPlayer>
    );
  }
}
