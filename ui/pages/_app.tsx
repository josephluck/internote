import * as Sentry from "@sentry/node";
import App from "next/app";
import Head from "next/head";
import React from "react";
import { createGlobalStyle } from "styled-components";

import { env } from "../env";
import { injectTwine } from "../store";
import { ShortcutsProvider } from "../styles/shortcuts";
import { SnippetsProvider } from "../styles/snippets-context";
import { InternoteThemes } from "../styles/theme-provider";
import { font } from "../theming/symbols";
import { sansSerif } from "../theming/themes";

Sentry.init({
  enabled: env.NODE_ENV === "production",
  dsn: env.SENTRY_DSN,
});

export class Application extends App {
  componentDidMount() {
    const { store } = this.props as any;
    store.actions.auth.scheduleRefresh();
  }
  render() {
    const { Component, pageProps, store, err } = this.props as any;
    return (
      <InternoteThemes>
        <>
          <Head>
            <title>Internote</title>
          </Head>
          <GlobalStyles />
          <ShortcutsProvider>
            <SnippetsProvider>
              <Component {...pageProps} err={err} store={store} />
            </SnippetsProvider>
          </ShortcutsProvider>
        </>
      </InternoteThemes>
    );
  }
}

export default injectTwine(Application);

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body, html, #__next {
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
`;
