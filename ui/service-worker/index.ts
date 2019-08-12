import UrlPattern from "url-pattern";

declare const self: ServiceWorkerGlobalScope;

// const sleep = (duration: number = 5000) =>
//   new Promise(resolve => setTimeout(resolve, duration));

const log = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);

self.addEventListener("fetch", async (event: any) => {
  const handler = router([
    {
      path: "notes/:id",
      handler: async event => {
        log("Handling fetch request", { event });
        // await sleep(5000);
        log("Slept for 5s");
        const response = await fetch(event.request);
        log("Response", { response });
        return response;
      }
    }
  ]);
  event.waitUntil(handler(event));
});

self.addEventListener("activate", () => self.clients.claim());

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;

interface Route {
  path: string;
  handler: (event: any) => Promise<any>;
}

const router = (routes: Route[]) => {
  return (event: any) => {
    const matches = routes.map(route => {
      const pattern = new UrlPattern(route.path);
      return pattern.match(event.request.url);
    });
    const firstMatch = matches.find(match => !!match);
    if (firstMatch) {
      event.waitUntil(firstMatch.handler(event));
    } else {
      event.waitUntil(fetch(event.request));
    }
  };
};
