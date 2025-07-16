import { Middleware } from "../../../mod.ts";

export const reqTime: Middleware = (ctx) => {
  ctx.state = {
    env: ctx.state.env,
    request_time: `${Date.now()}`,
    DENO_REGION: ctx.state.env.DENO_REGION,
  };
};
