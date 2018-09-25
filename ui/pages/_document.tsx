import * as React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { color } from "../styles/theme";

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    console.log("_document");
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }
  render() {
    return (
      <html>
        <Head>
          <meta name="theme-color" content={color.cinder} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=0"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
