import * as React from "react";
import App, { Container } from "next/app";
import { injectGlobal } from "styled-components";
import { colors } from "@internote/ui/styles/theme";

injectGlobal`
  @import url("https://rsms.me/inter/inter-ui.css");
  @import url("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
  body, html {
    color: ${colors.iron};
    background-color: ${colors.cinder};
    font-family: "inter", Helvetica, Arial, sans-serif;
    font-size: 24px;
    line-height: 1.6em;
  }
`;

export class Application extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default Application;
