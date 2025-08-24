import router from "@examples/react/router.ts";
import { RequestContext } from "@peko/core/types.ts";

router.middleware.unshift((ctx: RequestContext) => {
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
