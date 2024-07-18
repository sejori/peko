import { RequestContext } from "../Router.ts";
import { Middleware, Result, Next } from "../types.ts";

export type PromiseMiddleware = (
  ctx: RequestContext,
  next: Next
) => Promise<unknown>;

/**
 * Utility class for running middleware functions in a cascade
 */
export class Cascade {
  result: Result;
  called = 0;

  constructor(public ctx: RequestContext, public middleware: Middleware[]) {}

  static promisify(fcn: Middleware): PromiseMiddleware {
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
        if (res instanceof Response) this.result = res;
        else return await this.run();
      } catch (error) {
        throw error;
      }
    }

    return this.result;
  }
}
