import router from "../../example/preactSSR/router.ts";

export default {
  fetch(request: Request, env: Record<string, string>) {
    router.middleware.unshift((ctx) => {
      ctx.state.env = env;
    });
    return router.handle(request);
  },
};

console.log("Cloudflare Worker running with Peko router <3");
