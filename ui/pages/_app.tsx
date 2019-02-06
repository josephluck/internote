import * as React from "react";
import App, { Container } from "next/app";
import { createGlobalStyle } from "styled-components";
import { color, font } from "../styles/theme";
import { makeStore, State, Actions } from "../store";
import { withTwine } from "../store/with-twine";

const GlobalStyles = createGlobalStyle`
  @import url("https://rsms.me/inter/inter-ui.css");
  * {
    box-sizing: border-box;
  }
  body, html, #__next {
    color: ${color.iron};
    background-color: ${color.cinder};
    font-family: ${font.family.inter};
    font-size: ${font._24.size};
    line-height: ${font._24.lineHeight};
    height: 100%;
    width: 100%;
    min-height: 100%;
    min-width: 100%;
    overflow: auto;
    padding: 0;
    margin: 0;
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
        <GlobalStyles />
        <Component {...pageProps} store={store} />
      </Container>
    );
  }
}

export default withTwine<State, Actions>(makeStore, Application);
