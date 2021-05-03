import { router } from "./deps.ts";
import { notFound } from "./util/response.ts";
import { loadProvider } from "./util/provider.ts";

addEventListener("fetch", (event: FetchEvent) => {
  try {
    const provider = loadProvider();
    event.respondWith(
      router(
        {
          "/:platform/:version": provider,
        },
        (_req) => {
          return notFound();
        }
      )(event.request)
    );
  } catch (error) {
    console.log(error);
    event.respondWith(notFound());
    return;
  }
});
