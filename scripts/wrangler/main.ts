import router from "../../example/preactSSR/router.ts";

export default {
  fetch(request: Request) {
    return router.handle(request);
  },
} satisfies ExportedHandler;

console.log("Cloudflare Worker running with Peko router <3");
