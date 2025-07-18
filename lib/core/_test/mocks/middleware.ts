import { Middleware, Handler } from "../../types.ts";
import { DefaultState } from "../../context.ts";

export interface CascadeTestContext extends DefaultState {
  middleware1: {
    start: number;
    end?: number;
    res?: Response | void;
  }
  middleware2?: {
    start: number;
    end?: number;
    res?: Response | void;
  }
  middleware3?: {
    start: number;
    end?: number;
    res?: Response | void;
  }
}

export const testMiddleware1: Middleware<CascadeTestContext> = async (ctx, next) => {
  const start = performance.now();
  ctx.state.middleware1 = { start };
  await new Promise((res) => setTimeout(res, 1));
  const res = await next();
  const end = performance.now();
  ctx.state.middleware1 = { start, end, res };
};

export const testMiddleware2: Middleware<CascadeTestContext> = async (ctx, next) => {
  const start = performance.now();
  ctx.state.middleware2 = { start };
  await new Promise((res) => setTimeout(res, 1));
  const res = await next();
  const end = performance.now();
  ctx.state.middleware2 = { start, end, res };
};

export const testMiddleware3: Middleware<CascadeTestContext> = async (ctx, next) => {
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