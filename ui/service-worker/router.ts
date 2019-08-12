import UrlPattern from "url-pattern";

type Handler = (event: any, params: Record<string, string>) => Promise<any>;

interface Route {
  path: string;
  handler: Handler;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export const makeRouter = () => {
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
