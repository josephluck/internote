import React from "react";
import { ThemeProvider } from "styled-components";

import { useStately } from "../store/store";

export function InternoteThemes({ children }: { children: React.ReactNode }) {
  const colorTheme = useStately((state) => state.preferences.colorTheme.theme);
  const fontTheme = useStately((state) => state.preferences.fontTheme.theme);

  return (
    <ThemeProvider theme={{ ...colorTheme, ...fontTheme }}>
      {children as any}
    </ThemeProvider>
  );
}
