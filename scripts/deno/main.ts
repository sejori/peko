import router from "../../example/preactSSR/router.ts";

// Start Deno server with Peko router :^)
Deno.serve(
  {
    port: 7777,
  },
  (req) =>
    router.use((ctx) => (ctx.state.env = Deno.env.toObject())).handle(req)
);

console.log("Deno server running with Peko router <3");
