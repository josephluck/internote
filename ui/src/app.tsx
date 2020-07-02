import { Router } from "@reach/router";
import React from "react";

import { Authenticate } from "./pages/authenticate";

const App = () => (
  <Router>
    <Authenticate path="/authenticate" />
  </Router>
);

export default App;
