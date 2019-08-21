import * as React from "react";
import App, { Container } from "next/app";
import { font, borderRadius } from "../theming/symbols";
import { injectTwine } from "../store";
import { createGlobalStyle } from "styled-components";
import Head from "next/head";
import { sansSerif } from "../theming/themes";
import { ShortcutsProvider } from "../styles/shortcuts";
import { InternoteThemes } from "../styles/theme-provider";

const GlobalStyles = createGlobalStyle`
  @import url("https://rsms.me/inter/inter-ui.css");
  @import url('https://fonts.googleapis.com/css?family=EB+Garamond:400,500,700,800|Noto+Sans+SC:400,500,700,900|Overpass+Mono:400,600,700|Lora:400,700|Crimson+Text:400,600,700|Source+Code+Pro:400,500,700,900|Spectral:400,500,700,800');
  * {
    box-sizing: border-box;
  }
  body, html, #__next {
    color: ${props => props.theme.appText};
    background-color: ${props => props.theme.appBackground};
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

  .monaco-editor {
    overflow: hidden;
    border-radius: ${borderRadius._4};
  }
  .monaco-editor-background {
    background: ${props => props.theme.codeBlockBackground} !important;
  }
  .monaco-editor .scroll-decoration {
    display: none;
  }
  .monaco-editor .margin-view-overlays .current-line-margin {
    border: 0 !important;
  }
`;

export class Application extends App {
  componentDidMount() {
    const { store } = this.props as any;
    store.actions.auth.scheduleRefresh();
  }
  render() {
    const { Component, pageProps, store } = this.props as any;
    return (
      <Container>
        <InternoteThemes>
          <>
            <Head>
              <title>Internote</title>
            </Head>
            <GlobalStyles />
            <ShortcutsProvider>
              <Component {...pageProps} store={store} />
            </ShortcutsProvider>
          </>
        </InternoteThemes>
      </Container>
    );
  }
}

export default injectTwine(Application);
