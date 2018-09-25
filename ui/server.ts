import * as next from "next";
import * as express from "express";

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressApp = express();
  expressApp
    .get("/_next/on-demand-entries-ping", handler as any)
    .get("*", (req, res) => {
      try {
        console.log("Hello");
        const foo = handler(req, res)
          .then(console.log)
          .catch(console.error) as any;
        console.log(foo);
        return foo;
      } catch (e) {
        console.error(e);
        throw e;
      }
    })
    .listen(3000, () => {
      console.log(`Next application running on port ${3000}`);
    });
});
