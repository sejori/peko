import router from "../../example/preactSSR/router.ts";

Bun.serve({
  port: 8080,
  fetch(req) {
    return router.handle(req);
  },
});

console.log("Bun server running with Peko router <3");
