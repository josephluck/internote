import React from "react";
import { ExpandingIconButton } from "./expanding-icon-button";
import {
  faSpinner,
  faMicrophone,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  render() {
    return (
      <ExpandingIconButton
        forceShow={!!this.props.speechSrc}
        collapsedContent={
          this.props.speechSrc ? (
            <div>
              <audio autoPlay key={this.props.speechSrc}>
                <source src={this.props.speechSrc} type="audio/mpeg" />
              </audio>
              <div onClick={this.props.onDiscardSpeech}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          ) : (
            "Speech"
          )
        }
        onClick={!this.props.speechSrc ? this.props.onRequestSpeech : undefined}
        icon={
          this.props.isSpeechLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} />
          )
        }
      />
    );
  }
}
