import React from "react";

import { StoriesOf } from "../types";
import { Modal } from "./modal";

export default function (s: StoriesOf) {
  s("Modal", module)
    .add("default", () => (
      <Modal open onClose={console.log}>
        I'm a modal
      </Modal>
    ))
    .add("Without close icon", () => (
      <Modal showCloseIcon={false} open onClose={console.log}>
        I'm a modal
      </Modal>
    ))
    .add("With overlay", () => (
      <Modal withOverlay open onClose={console.log}>
        I'm a modal
      </Modal>
    ));
}
