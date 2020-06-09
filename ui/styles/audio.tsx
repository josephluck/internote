import React, { ReactNode, useState, useRef, useEffect } from "react";

interface RenderMethods {
  requestPlay: () => void;
  requestPause: () => void;
}

interface DerivedState {
  percentagePlayed: number;
}

export type AudioRenderProps = AudioState & RenderMethods & DerivedState;

type AudioStatus = "stopped" | "loading" | "playing" | "paused";

export interface AudioState {
  currentTime: number;
  duration: number;
  status: AudioStatus;
}

export function AudioPlayer({
  src,
  autoPlay,
  children,
  onFinished,
}: {
  src?: string | null;
  autoPlay: boolean;
  children: (renderProps: AudioRenderProps) => ReactNode;
  onFinished: () => void;
}) {
  const [currentTime, setCurrentTime] = useState(-1);
  const [duration, setDuration] = useState(-1);
  const [status, setStatus] = useState<AudioStatus>("stopped");
  const audioRef = useRef<HTMLMediaElement>();
  const timerInterval = useRef(-1);

  function storeDuration() {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  }

  function storeCurrentTime() {
    const audio = audioRef.current;
    if (audio && audio.currentTime !== currentTime) {
      setCurrentTime(audio.currentTime);
    }
  }

  function setUpInterval() {
    clearInterval();
    timerInterval.current = window.setInterval(storeCurrentTime, 333);
  }

  function clearInterval() {
    window.clearInterval(timerInterval.current);
  }

  function requestPlay() {
    const audio = audioRef.current;
    audio.play();
    setUpInterval();
  }

  function requestPause() {
    const audio = audioRef.current;
    audio.pause();
    clearInterval();
  }

  useEffect(() => {
    const audio = audioRef.current;

    const setStatusLoading = () => setStatus("loading");
    const setStatusPlaying = () => setStatus("playing");
    const setStatusPaused = () => setStatus("paused");
    const setStatusStopped = () => {
      setStatus("stopped");
      setCurrentTime(-1);
      setDuration(-1);
      clearInterval();
      onFinished();
    };

    if (audio) {
      audio.addEventListener("loadstart", setStatusLoading);
      audio.addEventListener("waiting", setStatusLoading);
      audio.addEventListener("stalled", setStatusLoading);
      audio.addEventListener("play", setStatusPlaying);
      audio.addEventListener("playing", setStatusPlaying);
      audio.addEventListener("suspend", setStatusPaused);
      audio.addEventListener("pause", setStatusPaused);
      audio.addEventListener("durationchange", storeDuration);
      audio.addEventListener("seeked", storeCurrentTime);
      audio.addEventListener("ended", setStatusStopped);
      if (autoPlay) {
        requestPlay();
      }
    }
    return function () {
      const audio = audioRef.current;
      if (audio) {
        audio.removeEventListener("loadstart", setStatusLoading);
        audio.removeEventListener("waiting", setStatusLoading);
        audio.removeEventListener("stalled", setStatusLoading);
        audio.removeEventListener("play", setStatusPlaying);
        audio.removeEventListener("playing", setStatusPlaying);
        audio.removeEventListener("suspend", setStatusPaused);
        audio.removeEventListener("pause", setStatusPaused);
        audio.removeEventListener("durationchange", storeDuration);
        audio.removeEventListener("seeked", storeCurrentTime);
        audio.removeEventListener("ended", setStatusStopped);
        clearInterval();
      }
    };
  }, [src, autoPlay, audioRef]);

  return (
    <>
      {src ? (
        <audio ref={audioRef} autoPlay={autoPlay}>
          <source src={src} type="audio/mpeg" />
        </audio>
      ) : null}
      {children({
        status,
        duration,
        currentTime,
        requestPlay: requestPlay,
        requestPause: requestPause,
        percentagePlayed:
          currentTime > 0 && duration > 0 ? (currentTime / duration) * 100 : 0,
      })}
    </>
  );
}
