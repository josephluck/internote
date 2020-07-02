import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import styled from "styled-components";

import { useTwineActions, useTwineState } from "../store";
import { spacing } from "../theming/symbols";
import { AudioPlayer, AudioRenderProps } from "./audio";
import {
  ToolbarIconType,
  toolbarIconMap,
  toolbarLabelMap,
  toolbarShortcutMap,
} from "./editor/types";
import { Shortcut } from "./shortcuts";
import { ToolbarButton } from "./toolbar-button";

export const Speech: React.FunctionComponent<{
  selectedText: string;
  noteId: string;
}> = ({ selectedText, noteId }) => {
  const src = useTwineState((state) => state.speech.speechSrc);

  const isLoading = false;

  const handleRequestSpeech = useTwineActions(
    (actions) => () =>
      actions.speech.requestSpeech({ words: selectedText, id: noteId }),
    [selectedText, noteId]
  );

  const handleFinished = useTwineActions((actions) => () =>
    actions.speech.setSpeechSrc(null)
  );

  const handleCancelPress = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();
      handleFinished();
    },
    [handleFinished]
  );

  const onIconClick = useCallback(
    (audioState: AudioRenderProps) => {
      if (!src) {
        handleRequestSpeech();
        return;
      }
      if (isLoading || audioState.status === "loading") {
        return;
      }
      if (audioState.status === "playing") {
        audioState.requestPause();
        return;
      }
      if (audioState.status === "paused" || audioState.status === "stopped") {
        audioState.requestPlay();
        return;
      }
    },
    [isLoading, src, handleRequestSpeech]
  );

  return (
    <>
      {(!!src || isLoading) && (
        <Shortcut
          keyCombo="esc"
          callback={handleFinished}
          id="cancel-speech"
          description="Cancel speech"
        />
      )}
      <AudioPlayer src={src} autoPlay onFinished={handleFinished}>
        {(audio) => {
          const iconName: ToolbarIconType =
            isLoading || audio.status === "loading"
              ? "speech-loading"
              : audio.status === "playing"
              ? "speech-playing"
              : audio.status === "paused" || audio.status === "stopped"
              ? "speech-paused"
              : "speech";
          return (
            <>
              <ToolbarButton
                forceExpand={!!src || isLoading}
                onClick={() => onIconClick(audio)}
                icon={toolbarIconMap[iconName]}
                name={toolbarLabelMap.speech}
                shortcut={toolbarShortcutMap.speech}
                label={
                  <CollapsedWrapper>
                    {src ? (
                      <Flex alignItems="center">
                        <TimelineWrap>
                          <TimelineInner
                            style={{ width: `${audio.percentagePlayed}%` }}
                          />
                        </TimelineWrap>
                        <div onMouseDown={handleCancelPress}>
                          <FontAwesomeIcon icon={faTimes} />
                        </div>
                      </Flex>
                    ) : isLoading ? (
                      "Loading"
                    ) : (
                      "Speech"
                    )}
                  </CollapsedWrapper>
                }
              />
            </>
          );
        }}
      </AudioPlayer>
    </>
  );
};

const CollapsedWrapper = styled.div`
  display: flex;
  align-items: center;
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
