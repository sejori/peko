import { RequestContext, Middleware, Result, Next, Handler } from "../types.ts";

export type PromiseHandler = (
  ctx: RequestContext,
) => Promise<Response>;
export type PromiseMiddleware = (
  ctx: RequestContext,
  next: Next
) => Promise<Result>;

/**
 * Utility class for running middleware functions in a cascade
 */
export class Cascade {
  result: Result;
  called = 0;

  constructor(public ctx: RequestContext, public middleware: Middleware[]) {}

  static promisify(fcn: Handler): PromiseHandler
  static promisify(fcn: Middleware): PromiseMiddleware
  static promisify(fcn: Handler | Middleware): PromiseHandler | PromiseMiddleware {
    return fcn.constructor.name === "AsyncFunction"
      ? (fcn as PromiseMiddleware)
      : (ctx, next) =>
          new Promise((res, rej) => {
            try {
              res(fcn(ctx, next));
            } catch (e) {
              rej(e);
            }
          });
  }

  async run(): Promise<Result> {
    if (this.middleware[this.called]) {
      try {
        const res = await this.middleware[this.called++](this.ctx, () =>
          this.run.call(this)
        );
        if (res) this.result = res;
        else return await this.run();
      } catch (error) {
        throw error;
      }
    }

    return this.result;
  }
}
