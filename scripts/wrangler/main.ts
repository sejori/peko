import { RequestContext } from "@peko/core/types.ts";
import router from "@examples/react/router.ts";

export default {
  fetch(request: Request, env: Record<string, string>) {
    router.middleware.unshift((ctx: RequestContext) => {
      ctx.state.env = env;
    });
    return router.handle(request);
  },
};

console.log("Cloudflare Worker running with Peko router <3");
