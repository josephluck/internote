import "@fortawesome/fontawesome-svg-core/styles.css";
import * as React from "react";
const storiesOf = require("@storybook/react").storiesOf;
const configure = require("@storybook/react").configure;
const Router = require("next/router").default;

import { GlobalStyles } from "../pages/_app";
import { makeStore } from "../store";
import { makeTwineHooks } from "../store/with-twine";

// import {dark, light} from '../theming/themes'

Router.router = { push: () => {}, prefetch: () => {}, asPath: "blah" };

const store = makeStore();
const { TwineContext } = makeTwineHooks(makeStore);

function Wrapper({ children }) {
  return (
    <TwineContext.Provider value={store}>
      <GlobalStyles />
      <InternoteThemes>{children}</InternoteThemes>
    </TwineContext.Provider>
  );
}

function sOf(a, b) {
  return storiesOf(a, b).addDecorator(story => <Wrapper>{story()}</Wrapper>);
}

function requireAll(requireContext) {
  return requireContext
    .keys()
    .map(requireContext)
    .map(module => module.default(sOf));
}

function loadStories() {
  requireAll(require.context("..", true, /story.tsx?$/));
}

configure(loadStories, module);
