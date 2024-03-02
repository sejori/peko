import router from "../examples/preact/router.ts";

Bun.serve({
  port: 7777,
  fetch(req) {
    return router.handle(req);
  },
});

console.log("Bun server running with Peko router <3");
console.log(await (await fetch("http://localhost:7777/")).json());
