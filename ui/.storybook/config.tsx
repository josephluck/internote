import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";
const storiesOf = require("@storybook/react").storiesOf;
const configure = require("@storybook/react").configure;
const Router = require("next/router").default;

import { GlobalStyles } from "../pages/_app";
import { makeStore } from "../store";
import { makeTwineHooks } from "../store/with-twine";
import { InternoteThemes } from "../styles/theme-provider";
import { SnippetsProvider } from "../styles/snippets-context";

// import {dark, light} from '../theming/themes'

Router.router = { push: () => {}, prefetch: () => {}, asPath: "blah" };

const store = makeStore();
const { TwineContext } = makeTwineHooks(makeStore);

function Wrapper({ children }: { children: any }) {
  return (
    <TwineContext.Provider value={store}>
      <InternoteThemes>
        <SnippetsProvider>
          <>
            <GlobalStyles />
            {children}
          </>
        </SnippetsProvider>
      </InternoteThemes>
    </TwineContext.Provider>
  );
}

function sOf(a: any, b: any) {
  return storiesOf(a, b).addDecorator((story: any) => (
    <Wrapper>{story()}</Wrapper>
  ));
}

function requireAll(requireContext: any) {
  return requireContext
    .keys()
    .map(requireContext)
    .map((module: any) => module.default(sOf));
}

function loadStories() {
  requireAll(require.context("..", true, /story.tsx?$/));
}

configure(loadStories, module);
