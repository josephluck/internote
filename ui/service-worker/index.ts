declare const self: ServiceWorkerGlobalScope;

// const sleep = (duration: number = 5000) =>
//   new Promise(resolve => setTimeout(resolve, duration));

const log = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);

self.addEventListener("fetch", async (event: any) => {
  const handler = async () => {
    log("Handling fetch request", { event });
    // await sleep(5000);
    log("Slept for 5s");
    const response = await fetch(event.request);
    log("Response", { response });
    return response;
  };

  event.waitUntil(handler());
});

self.addEventListener("activate", () => self.clients.claim());

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;
