import * as React from "react";

interface RenderMethods {
  requestPlay: () => void;
  requestPause: () => void;
}

interface Props {
  src?: string | null;
  autoPlay: boolean;
  children: (renderProps: AudioState & RenderMethods) => React.ReactNode;
}

type AudioStatus = "stopped" | "loading" | "playing" | "paused";

export interface AudioState {
  current: number;
  duration: number;
  status: AudioStatus;
}

export const defaultAudioState: AudioState = {
  current: -1,
  duration: -1,
  status: "stopped"
};

export class AudioPlayer extends React.Component<Props, AudioState> {
  audioRef: React.RefObject<HTMLAudioElement>;

  constructor(props: Props) {
    super(props);
    this.state = defaultAudioState;
    this.audioRef = React.createRef();
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillReceiveProps(prevProps: Props) {
    if (!this.props.src && !!prevProps.src) {
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
      audio.addEventListener(
        "canplay",
        this.props.autoPlay ? this.setStatusPlaying : this.setStatusStopped
      );
      audio.addEventListener("ended", this.setStatusStopped);
      audio.addEventListener("play", this.setStatusPlaying);
      audio.addEventListener("playing", this.setStatusPlaying);
      audio.addEventListener("suspend", this.setStatusPaused);
      audio.addEventListener("pause", this.setStatusPaused);
      audio.addEventListener("durationchange", this.setDuration);
      audio.addEventListener("timeupdate", this.setCurrent);
    }
  };

  removeListeners = () => {
    const audio = this.audioRef.current;
    if (audio) {
      audio.removeEventListener("loadstart", this.setStatusLoading);
      audio.removeEventListener("waiting", this.setStatusLoading);
      audio.removeEventListener("stalled", this.setStatusLoading);
      audio.removeEventListener(
        "canplay",
        this.props.autoPlay ? this.setStatusPlaying : this.setStatusStopped
      );
      audio.removeEventListener("ended", this.setStatusStopped);
      audio.removeEventListener("play", this.setStatusPlaying);
      audio.removeEventListener("playing", this.setStatusPlaying);
      audio.removeEventListener("suspend", this.setStatusPaused);
      audio.removeEventListener("pause", this.setStatusPaused);
      audio.removeEventListener("durationchange", this.setDuration);
      audio.removeEventListener("timeupdate", this.setCurrent);
    }
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

  setCurrent = () => {
    const audio = this.audioRef.current;
    if (audio) {
      this.setState({ current: audio.currentTime });
    }
  };

  requestPlay = () => {
    const audio = this.audioRef.current;
    if (audio) {
      audio.play();
    }
  };

  requestPause = () => {
    const audio = this.audioRef.current;
    if (audio) {
      audio.pause();
    }
  };

  render() {
    return (
      <>
        {this.props.src ? (
          <audio
            autoPlay={this.props.autoPlay}
            key={this.props.src}
            ref={this.audioRef}
          >
            <source src={this.props.src} type="audio/mpeg" />
          </audio>
        ) : null}
        {this.props.children({
          ...this.state,
          requestPlay: this.requestPlay,
          requestPause: this.requestPause
        })}
      </>
    );
  }
}
