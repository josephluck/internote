import React from "react";
import {
  faSpinner,
  faMicrophone,
  faTimes,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { AudioRenderProps, AudioPlayer } from "./audio";
import styled from "styled-components";
import { spacing } from "../theming/symbols";
import { Flex } from "@rebass/grid";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap,
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
  background: ${(props) => props.theme.audioTimelineInactive};
  overflow: hidden;
  margin-right: ${spacing._0_25};
`;

const TimelineInner = styled.div`
  height: 6px;
  border-radius: 9999px;
  background: ${(props) => props.theme.audioTimelineActive};
  transition: width 333ms linear;
`;

export function Speech({
  src,
  isLoading,
  onRequest,
  onDiscard,
  onFinished,
}: {
  src: string;
  isLoading: boolean;
  onRequest: () => any;
  onDiscard: () => any;
  onFinished: () => any;
}) {
  function onIconClick(audioState: AudioRenderProps) {
    if (isLoading || audioState.status === "loading" || !src) {
      return;
    } else if (audioState.status === "playing") {
      audioState.requestPause();
    } else if (
      audioState.status === "paused" ||
      audioState.status === "stopped"
    ) {
      audioState.requestPlay();
    }
  }
  return (
    <AudioPlayer src={src} autoPlay onFinished={onFinished}>
      {(audio) => (
        <CollapseWidthOnHover
          onClick={!src ? onRequest : undefined}
          forceShow={!!src || isLoading}
          collapsedContent={
            <CollapsedWrapper>
              {src ? (
                <Flex alignItems="center">
                  <TimelineWrap>
                    <TimelineInner
                      style={{ width: `${audio.percentagePlayed}%` }}
                    />
                  </TimelineWrap>
                  <ToolbarExpandingButtonIconWrap onClick={onDiscard}>
                    <FontAwesomeIcon icon={faTimes} />
                  </ToolbarExpandingButtonIconWrap>
                </Flex>
              ) : isLoading ? (
                "Loading"
              ) : (
                "Speech"
              )}
            </CollapsedWrapper>
          }
        >
          {(collapse) => (
            <ToolbarExpandingButton forceShow={!!src}>
              <ToolbarExpandingButtonIconWrap
                onClick={() => onIconClick(audio)}
              >
                {renderIcon(audio, isLoading, src)}
              </ToolbarExpandingButtonIconWrap>
              {collapse.renderCollapsedContent()}
            </ToolbarExpandingButton>
          )}
        </CollapseWidthOnHover>
      )}
    </AudioPlayer>
  );
}

function renderIcon(
  audioState: AudioRenderProps,
  isLoading: boolean,
  src: string
) {
  if (isLoading || audioState.status === "loading") {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  } else if (!src) {
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
}
