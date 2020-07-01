import React from "react";

import { env } from "./env";

const App = () => <div>Hello, world, {JSON.stringify(env)}</div>;

export default App;
