import UrlPattern from "url-pattern";

type Handler = (
  event: FetchEvent,
  params: Record<string, string>
) => Promise<any>;

interface Route {
  path: string;
  handler: Handler;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export const makeRouter = () => {
  let routes: Route[] = [];

  const add = (route: Route) => routes.push(route);

  const handle = (event: FetchEvent) => {
    const { request } = event;
    const route = routes.find(({ path, method }) => {
      const pattern = new UrlPattern(path);
      const pathname = getLocation(request.url).pathname;
      const urlMatch = pattern.match(pathname);
      const methodMatch = !method || method === request.method;
      return urlMatch && methodMatch;
    });
    if (route) {
      const pattern = new UrlPattern(route.path);
      const pathname = getLocation(request.url).pathname;
      const params = pattern.match(pathname);
      event.respondWith(route.handler(event, params || {}));
    } else {
      event.respondWith(fetch(request));
    }
  };

  return { add, handle };
};

function getLocation(href: string) {
  var match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}
