const sleep = (duration: number = 5000) =>
  new Promise(resolve => setTimeout(resolve, duration));

self.addEventListener("sync", async (event: any) => {
  await event.waitUntil(sleep(5000));
  console.log("Done");
  event.respondWith("Done!");
});

self.addEventListener("fetch", async (event: any) => {
  console.log("Caught request for", event.request.url);
  await sleep(1000);
  console.log("Finished sleeping for 1s");
  const response = await fetch(event.request);
  console.log("Response", { response });
  event.respondWith(response);
});

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;
