import {
  faMicrophone,
  faPause,
  faPlay,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import styled from "styled-components";
import { useTwineActions, useTwineState } from "../store";
import { spacing } from "../theming/symbols";
import { AudioPlayer, AudioRenderProps } from "./audio";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap,
} from "./toolbar-expanding-button";

export const Speech: React.FunctionComponent<{
  selectedText: string;
  noteId: string;
}> = ({ selectedText, noteId }) => {
  const src = useTwineState((state) => state.speech.speechSrc);

  const isLoading = useTwineState(
    (state) => state.speech.loading.requestSpeech
  );

  const handleRequest = useTwineActions(
    (actions) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      return actions.speech.requestSpeech({ words: selectedText, id: noteId });
    },
    [selectedText, noteId]
  );

  const handleFinished = useTwineActions((actions) => () =>
    actions.speech.setSpeechSrc(null)
  );

  const onIconClick = useCallback(
    (audioState: AudioRenderProps) => {
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
    },
    [isLoading, src]
  );

  return (
    <AudioPlayer src={src} autoPlay onFinished={handleFinished}>
      {(audio) => (
        <CollapseWidthOnHover
          onMouseDown={!src ? handleRequest : undefined}
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
                  <ToolbarExpandingButtonIconWrap onClick={handleFinished}>
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
                <AudioIcon audioState={audio} isLoading={isLoading} src={src} />
              </ToolbarExpandingButtonIconWrap>
              {collapse.renderCollapsedContent()}
            </ToolbarExpandingButton>
          )}
        </CollapseWidthOnHover>
      )}
    </AudioPlayer>
  );
};

const AudioIcon: React.FunctionComponent<{
  audioState: AudioRenderProps;
  isLoading: boolean;
  src: string;
}> = ({ audioState, isLoading, src }) => {
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
};

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
