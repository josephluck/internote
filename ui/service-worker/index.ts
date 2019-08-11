const sleep = (duration: number = 5000) =>
  new Promise(resolve => setTimeout(resolve, duration));

self.addEventListener("sync", async (event: any) => {
  await event.waitUntil(sleep(5000));
  console.log("Done");
  event.respondWith("Done!");
});

self.addEventListener("fetch", async (event: any) => {
  console.log("Caught request for", event.request.url);
  const response = await fetch(event.request);
  console.log("Response", { response });
  event.respondWith(response);
});
