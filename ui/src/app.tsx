import { Router } from "@reach/router";
import React from "react";
import GoogleFontLoader from "react-google-font-loader";
import { createGlobalStyle } from "styled-components";

import { Authenticate } from "./pages/authenticate";
import { Home } from "./pages/home";
import { Note } from "./pages/note";
import { useStately } from "./store/store";
import { ConfirmationModal, ConfirmationProvider } from "./styles/confirmation";
import { InternoteThemes } from "./styles/theme-provider";
import { font } from "./theming/symbols";
import { googleFontsWeights, sansSerif } from "./theming/themes";

const App = () => {
  const fontTheme = useStately((state) => state.preferences.fontTheme);

  return (
    <InternoteThemes>
      <ConfirmationProvider>
        <Router component={({ children }) => <>{children}</>}>
          <Authenticate path="/authenticate" />
          <Note path="/:noteId" />
          <Home path="/" />
        </Router>
        <GlobalStyles />
        <GoogleFontLoader
          fonts={[
            {
              font: fontTheme.theme.googleFontName,
              weights: googleFontsWeights,
            },
          ]}
        />
        <ConfirmationModal />
      </ConfirmationProvider>
    </InternoteThemes>
  );
};

export default App;

export const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
}
body, html, #root {
  color: ${(props) => props.theme.appText};
  background-color: ${(props) => props.theme.appBackground};
  font-family: ${sansSerif.fontFamily};
  font-size: ${font._24.size};
  line-height: ${font._24.lineHeight};
  height: 100%;
  width: 100%;
  min-height: 100%;
  min-width: 100%;
  overflow: auto;
  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
}
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  background: inherit;
}
a {
  text-decoration: none;
}
`;
