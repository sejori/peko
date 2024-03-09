import { Middleware, Handler } from "../../lib/types.ts";
import { Router } from "../../lib/Router.ts";

export const testMiddleware1: Middleware = async (ctx, next) => {
  const start = performance.now();
  ctx.state.middleware1 = { start };
  await new Promise((res) => setTimeout(res, 1));
  const res = await next();
  const end = performance.now();
  ctx.state.middleware1 = { start, end, res };
};

export const testMiddleware2: Middleware = async (ctx, next) => {
  const start = performance.now();
  ctx.state.middleware2 = { start };
  await new Promise((res) => setTimeout(res, 1));
  const res = await next();
  const end = performance.now();
  ctx.state.middleware2 = { start, end, res };
};

export const testMiddleware3: Middleware = async (ctx, next) => {
  const start = performance.now();
  ctx.state.middleware3 = { start };
  await new Promise((res) => setTimeout(res, 1));
  const res = await next();
  const end = performance.now();
  ctx.state.middleware3 = { start, end, res };
};

export const testHandler: Handler = async (ctx) => {
  await new Promise((res) => setTimeout(res, 1));
  return new Response(
    JSON.stringify({ ...ctx.state, createdAt: performance.now() })
  );
};

export const getTestRouter = () => {
  const router = new Router();
  router.addRoute(
    "/test",
    [testMiddleware1, testMiddleware2, testMiddleware3],
    testHandler
  );
  router.get("/bench", () => new Response("Hello, bench!"));
  return router;
};
