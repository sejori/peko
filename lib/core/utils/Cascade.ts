import { BaseState, RequestContext } from "../context.ts";
import { Middleware, Result, Next, Handler } from "../types.ts";

export type PromiseHandler<S extends BaseState = BaseState> = (
  ctx: RequestContext<S>,
) => Promise<Response>;
export type PromiseMiddleware<S extends BaseState = BaseState> = (
  ctx: RequestContext<S>,
  next: Next
) => Promise<Result>;

/**
 * Utility class for running middleware functions in a cascade
 */
export class Cascade<C extends BaseState = BaseState> {
  result: Result;
  called = 0;

  constructor(public ctx: RequestContext<C>, public middleware: Middleware<C>[]) {}

  static promisify<S extends BaseState, H extends Handler<S>>(fcn: H): PromiseHandler<S>
  static promisify<S extends BaseState, M extends Middleware<S>>(fcn: M): PromiseMiddleware<S>
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
