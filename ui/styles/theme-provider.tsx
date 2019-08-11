import { useTwineState } from "../store";
import { ThemeProvider } from "../theming/styled";

export function InternoteThemes({ children }: { children: React.ReactNode }) {
  const colorTheme = useTwineState(state => state.preferences.colorTheme.theme);
  const fontTheme = useTwineState(state => state.preferences.fontTheme.theme);

  return (
    <ThemeProvider theme={colorTheme}>
      <ThemeProvider theme={fontTheme as any}>{children as any}</ThemeProvider>
    </ThemeProvider>
  );
}
