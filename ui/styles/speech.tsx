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
  src: string;
  isLoading: boolean;
  onRequest: () => any;
  onDiscard: () => any;
  onFinished: () => any;
}

interface State {}

export class Speech extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  onIconClick = (audioState: AudioRenderProps) => {
    if (this.props.isLoading || audioState.status === "loading") {
      return;
    } else if (!this.props.src) {
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
    if (this.props.isLoading || audioState.status === "loading") {
      return <FontAwesomeIcon icon={faSpinner} spin />;
    } else if (!this.props.src) {
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
      <AudioPlayer
        src={this.props.src}
        autoPlay
        onFinished={this.props.onFinished}
      >
        {audio => (
          <CollapseWidthOnHover
            onClick={!this.props.src ? this.props.onRequest : undefined}
            forceShow={!!this.props.src || this.props.isLoading}
            collapsedContent={
              <CollapsedWrapper>
                {this.props.src ? (
                  <Flex alignItems="center">
                    <TimelineWrap>
                      <TimelineInner
                        style={{ width: `${audio.percentagePlayed}%` }}
                      />
                    </TimelineWrap>
                    <ToolbarExpandingButtonIconWrap
                      onClick={this.props.onDiscard}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </ToolbarExpandingButtonIconWrap>
                  </Flex>
                ) : this.props.isLoading ? (
                  "Loading"
                ) : (
                  "Speech"
                )}
              </CollapsedWrapper>
            }
          >
            {collapse => (
              <ToolbarExpandingButton forceShow={!!this.props.src}>
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
