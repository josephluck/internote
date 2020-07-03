import { navigate } from "@reach/router";
import { AxiosError } from "axios";

import { exitFullscreen, requestFullScreen } from "../../utilities/fullscreen";
import { signOut } from "../auth/auth";
import { createNote, fetchNotes } from "../notes/notes";
import { store } from "../store";
import { uiInitialState } from "./state";

export const resetState = store.createMutator(
  (state) => (state.ui = uiInitialState)
);

export const setFullscreen = store.createMutator(
  (state, isFullscreen: boolean) => (state.ui.isFullscreen = isFullscreen)
);

export const navigateToFirstNote = store.createEffect(async () => {
  const notes = await fetchNotes();
  if (notes.length === 0) {
    createNote();
  } else if (notes[0]) {
    navigate(`/${notes[0].noteId}`);
  }
});

export const handleApiError = store.createEffect(
  (_state, error: AxiosError) => {
    if (error && error.response && [401, 403].includes(error.response.status)) {
      signOut();
    }
  }
);

export const toggleFullscreen = store.createEffect(
  (_state, isFullscreen: boolean) => {
    // NB: no need to set state here since the window listener does that for us
    if (isFullscreen) {
      requestFullScreen(document.body);
    } else {
      exitFullscreen();
    }
  }
);

document.addEventListener("fullscreenchange", () => {
  const doc = document as any;

  const fullscreenElm: HTMLElement | null =
    doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement;

  setFullscreen(Boolean(fullscreenElm));
});
