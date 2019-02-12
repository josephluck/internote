import * as styledComponents from "styled-components";
import { Theme } from "./themes";

const {
  default: styled,
  css,
  ThemeProvider,
  withTheme,
  keyframes
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>;

const createGlobalStyle = (styledComponents as any).createGlobalStyle;
const ServerStyleSheet = (styledComponents as any).ServerStyleSheet;

export {
  styled,
  withTheme,
  css,
  createGlobalStyle,
  ServerStyleSheet,
  ThemeProvider,
  keyframes
};
