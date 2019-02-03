import * as React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { color } from "../styles/theme";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    // NB: collect server-side style sheets as per
    //     https://github.com/zeit/next.js/pull/5631/files
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
          sheet.collectStyles(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...(initialProps || {}),
      styles: [...initialProps.styles, ...sheet.getStyleElement()]
    };
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
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
