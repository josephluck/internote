import * as React from "react";

interface RenderMethods {
  requestPlay: () => void;
  requestPause: () => void;
}

interface DerivedState {
  percentagePlayed: number;
}

export type AudioRenderProps = AudioState & RenderMethods & DerivedState;

interface Props {
  src?: string | null;
  autoPlay: boolean;
  children: (renderProps: AudioRenderProps) => React.ReactNode;
}

type AudioStatus = "stopped" | "loading" | "playing" | "paused";

export interface AudioState {
  currentTime: number;
  duration: number;
  status: AudioStatus;
}

export const defaultAudioState: AudioState = {
  currentTime: -1,
  duration: -1,
  status: "stopped"
};

export class AudioPlayer extends React.Component<Props, AudioState> {
  audioRef: React.RefObject<HTMLAudioElement>;
  timerInterval = -1;

  constructor(props: Props) {
    super(props);
    this.state = defaultAudioState;
    this.audioRef = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.src !== this.props.src) {
      this.setState(defaultAudioState);
      this.removeListeners();
      this.addListeners();
    } else if (!this.props.src) {
      this.removeListeners();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    const audio = this.audioRef.current;
    if (audio) {
      audio.addEventListener("loadstart", this.setStatusLoading);
      audio.addEventListener("waiting", this.setStatusLoading);
      audio.addEventListener("stalled", this.setStatusLoading);
      if (this.props.autoPlay) {
        audio.addEventListener("canplay", this.setStatusPaused);
      }
      audio.addEventListener("play", this.setStatusPlaying);
      audio.addEventListener("playing", this.setStatusPlaying);
      audio.addEventListener("suspend", this.setStatusPaused);
      audio.addEventListener("pause", this.setStatusPaused);
      audio.addEventListener("durationchange", this.setDuration);
      audio.addEventListener("seeked", this.setCurrentTime);
      audio.addEventListener("ended", this.setStatusStopped);
      if (this.props.autoPlay) {
        this.requestPlay();
      }
    }
  };

  removeListeners = () => {
    const audio = this.audioRef.current;
    if (audio) {
      audio.removeEventListener("loadstart", this.setStatusLoading);
      audio.removeEventListener("waiting", this.setStatusLoading);
      audio.removeEventListener("stalled", this.setStatusLoading);
      if (this.props.autoPlay) {
        audio.removeEventListener("canplay", this.setStatusPaused);
      }
      audio.removeEventListener("play", this.setStatusPlaying);
      audio.removeEventListener("playing", this.setStatusPlaying);
      audio.removeEventListener("suspend", this.setStatusPaused);
      audio.removeEventListener("pause", this.setStatusPaused);
      audio.removeEventListener("durationchange", this.setDuration);
      audio.removeEventListener("seeked", this.setCurrentTime);
      audio.removeEventListener("ended", this.setStatusStopped);
      this.clearInterval();
    }
  };

  setUpInterval = () => {
    this.clearInterval();
    this.timerInterval = window.setInterval(this.setCurrentTime, 333);
  };

  clearInterval = () => {
    window.clearInterval(this.timerInterval);
  };

  setStatusStopped = () => {
    this.setState({ status: "stopped" });
  };

  setStatusLoading = () => {
    this.setState({ status: "loading" });
  };

  setStatusPlaying = () => {
    this.setState({ status: "playing" });
  };

  setStatusPaused = () => {
    this.setState({ status: "paused" });
  };

  setDuration = () => {
    const audio = this.audioRef.current;
    if (audio) {
      this.setState({ duration: audio.duration });
    }
  };

  setCurrentTime = () => {
    const audio = this.audioRef.current;
    if (audio && audio.currentTime !== this.state.currentTime) {
      this.setState({ currentTime: audio.currentTime });
    }
  };

  requestPlay = () => {
    const audio = this.audioRef.current;
    audio.play();
    this.setUpInterval();
  };

  requestPause = () => {
    const audio = this.audioRef.current;
    audio.pause();
    this.clearInterval();
  };

  render() {
    return (
      <>
        {this.props.src ? (
          <audio
            ref={this.audioRef}
            autoPlay={this.props.autoPlay}
            onLoad={this.addListeners}
          >
            <source src={this.props.src} type="audio/mpeg" />
          </audio>
        ) : null}
        {this.props.children({
          ...this.state,
          requestPlay: this.requestPlay,
          requestPause: this.requestPause,
          percentagePlayed:
            this.state.currentTime > 0 && this.state.duration > 0
              ? (this.state.currentTime / this.state.duration) * 100
              : 0
        })}
      </>
    );
  }
}
