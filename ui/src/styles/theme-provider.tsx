import React from "react";
import { ThemeProvider } from "styled-components";

import { useTwineState } from "../store";

export function InternoteThemes({ children }: { children: React.ReactNode }) {
  const colorTheme = useTwineState(
    (state) => state.preferences.colorTheme.theme
  );
  const fontTheme = useTwineState((state) => state.preferences.fontTheme.theme);

  return (
    <ThemeProvider theme={{ ...colorTheme, ...fontTheme }}>
      {children as any}
    </ThemeProvider>
  );
}
