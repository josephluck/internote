import { useTwine } from "../store";
import { ThemeProvider } from "../theming/styled";

export function InternoteThemes({ children }: { children: React.ReactNode }) {
  const [{ colorTheme, fontTheme }] = useTwine(
    state => ({
      colorTheme: state.preferences.colorTheme.theme,
      fontTheme: state.preferences.fontTheme.theme
    }),
    () => ({})
  );
  return (
    <ThemeProvider theme={colorTheme}>
      <ThemeProvider theme={fontTheme}>{children}</ThemeProvider>
    </ThemeProvider>
  );
}
