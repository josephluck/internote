import * as React from "react";
import App, { Container } from "next/app";
import { font } from "../theming/symbols";
import { makeStore, State, Actions } from "../store";
import { withTwine } from "../store/with-twine";
import { createGlobalStyle, ThemeProvider } from "../theming/styled";
import Head from "next/head";

const GlobalStyles = createGlobalStyle`
  @import url("https://rsms.me/inter/inter-ui.css");
  @import url('https://fonts.googleapis.com/css?family=EB+Garamond:400,500,700,800|Noto+Sans+SC:400,500,700,900|Overpass+Mono:400,600,700|Source+Code+Pro:400,500,700,900|Spectral:400,500,700,800');
  * {
    box-sizing: border-box;
  }
  body, html, #__next {
    color: ${props => props.theme.appText};
    background-color: ${props => props.theme.appBackground};
    font-family: ${props => props.theme.fontFamily};
    font-size: ${font._24.size};
    line-height: ${font._24.lineHeight};
    height: 100%;
    width: 100%;
    min-height: 100%;
    min-width: 100%;
    overflow: auto;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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

export class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props as any;
    return (
      <Container>
        <ThemeProvider theme={store.state.colorTheme.theme}>
          <ThemeProvider theme={store.state.fontTheme.theme}>
            <>
              <Head>
                <title>Internote</title>
              </Head>
              <GlobalStyles />
              <Component {...pageProps} store={store} />
            </>
          </ThemeProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default withTwine<State, Actions>(makeStore, Application);
