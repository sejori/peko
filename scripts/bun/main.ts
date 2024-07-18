import router from "../../example/preactSSR/router.ts";

Bun.serve({
  port: 8080,
  fetch(req) {
    return router.use((ctx) => ctx.state.env = process.env).handle(req);
});

console.log("Bun server running with Peko router <3");
