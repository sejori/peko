import router from "../../example/preactSSR/router.ts";

router.middleware.unshift((ctx) => {
  ctx.state.env = process.env 
});

Bun.serve({
  port: 8080,
  fetch(req) {
    return router.handle(req);
});

console.log("Bun server running with Peko router <3");
