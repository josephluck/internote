import React from "react";
import App, { Container } from "next/app";
import { font } from "../theming/symbols";
import { injectTwine } from "../store";
import { createGlobalStyle } from "styled-components";
import Head from "next/head";
import {
  sansSerif,
  googleFontsFamilies,
  googleFontsWeights
} from "../theming/themes";
import { ShortcutsProvider } from "../styles/shortcuts";
import { InternoteThemes } from "../styles/theme-provider";
import { SnippetsProvider } from "../styles/snippets-context";

const googleFontsUrls = googleFontsFamilies
  .map(family => `${family}:${googleFontsWeights.join(",")}`)
  .join("|");

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=${googleFontsUrls}');
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
  .monaco-editor-background, .monaco-editor .margin {
    background: ${props => props.theme.codeBlockBackground} !important;
  }
  .monaco-editor .scroll-decoration {
    display: none;
  }
  .monaco-editor .margin-view-overlays .current-line-margin {
    border: 0 !important;
  }
  .monaco-editor .decorationsOverviewRuler {
    opacity: 0;
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
              <script
                src="/static/monaco/monaco-expose.js"
                type="text/javascript"
              />
            </Head>
            <GlobalStyles />
            <ShortcutsProvider>
              <SnippetsProvider>
                <Component {...pageProps} store={store} />
              </SnippetsProvider>
            </ShortcutsProvider>
          </>
        </InternoteThemes>
      </Container>
    );
  }
}

export default injectTwine(Application);
