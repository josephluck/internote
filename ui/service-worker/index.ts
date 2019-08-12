import UrlPattern from "url-pattern";

declare const self: ServiceWorkerGlobalScope;

const sleep = (duration: number = 5000) =>
  new Promise(resolve => setTimeout(resolve, duration));

const log = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);

self.addEventListener("fetch", async (event: any) => {
  const rtr = router();

  rtr.add({
    path: "notes/:id",
    method: "PUT",
    handler: async (event, params) => {
      log("Handling update note request", { event, params });
      await sleep(5000);
      log("Slept for 5s");
      const response = await fetch(event.request);
      log("Response", { response });
      return response;
    }
  });

  event.waitUntil(rtr.handle(event));
});

self.addEventListener("activate", () => self.clients.claim());

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;

type Handler = (event: any, params: Record<string, string>) => Promise<any>;

interface Route {
  path: string;
  handler: Handler;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

const router = () => {
  let routes: Route[] = [];

  const add = (route: Route) => routes.push(route);

  const handle = (event: any) => {
    const { request } = event;
    const route = routes.find(({ path, method }) => {
      const pattern = new UrlPattern(path);
      const urlMatch = pattern.match(request.url);
      const methodMatch = !method || method === request.method;
      return urlMatch && methodMatch;
    });
    if (route) {
      const pattern = new UrlPattern(route.path);
      const params = pattern.match(request.url);
      event.waitUntil(route.handler(event, params || {}));
    } else {
      event.waitUntil(fetch(request));
    }
  };

  return { add, handle };
};
