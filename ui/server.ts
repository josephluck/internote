import * as path from "path";
import * as express from "express";
import * as next from "next";
import * as proxy from "express-http-proxy";

const IS_AWS = !!(
  process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV
);

console.log({ IS_AWS });

const app = express();

app.get("/static/:filename", (req, res) => {
  const file = path.resolve(`${__dirname}/static/${req.params.filename}`);
  res.sendFile(file);
});

if (!IS_AWS) {
  // Proxy HMR requests to :3001 to avoid running HMR stuff in the lambda
  const hmrProxy = proxy("http://localhost:3001/_next/webpack-hmr", {
    preserveHostHdr: true,
    userResHeaderDecorator(headers) {
      headers["Content-Type"] = "text/event-stream";
      return headers;
    }
  });
  app.use("/_next/webpack-hmr", hmrProxy);

  app.use("/", proxy("http://localhost:3001/"));
} else {
  const nextApp = next({
    dev: false
  });
  const nextProxy = nextApp.getRequestHandler();
  app.get("*", async (req, res) => {
    await nextApp.prepare();
    console.log({ req, res });
    const result = nextProxy(req, res);
    console.log({ res });
    return result;
  });
}

export default app;
