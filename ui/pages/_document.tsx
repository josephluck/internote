import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";
import { prepareClientExposedEnv } from "../env";
import { color } from "../theming/symbols";
import { googleFontsFamilies, googleFontsWeights } from "../theming/themes";
import htmlEscape from "htmlescape";

export default class InternoteDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();

    const page = renderPage((App) => (props) =>
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
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css?family=${googleFontsUrls}`}
          />
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `__ENV__=${htmlEscape(prepareClientExposedEnv())}`,
            }}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}

const googleFontsUrls = googleFontsFamilies
  .map((family) => `${family}:${googleFontsWeights.join(",")}`)
  .join("|");
