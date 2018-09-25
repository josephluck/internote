import * as next from "next";
import * as express from "express";

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressApp = express();
  expressApp
    .get("/_next/on-demand-entries-ping", handler as any)
    .get("*", handler as any)
    .listen(process.env.CLIENT_PORT || 80, () => {
      console.log(`Next application running on port ${process.env.CLIENT_PORT || 80}`);
    });
});
