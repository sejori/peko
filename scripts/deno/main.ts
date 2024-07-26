import router from "../../example/reactSSR/router.ts";

router.middleware.unshift((ctx) => {
  ctx.state.env = Deno.env.toObject();
});

// Start Deno server with Peko router :^)
Deno.serve(
  {
    port: 7777,
  },
  (req) => router.handle(req)
);

console.log("Deno server running with Peko router <3");
