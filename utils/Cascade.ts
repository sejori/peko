import { 
  RequestContext,
  PromiseMiddleware, 
  Middleware, 
  Result, 
  Next 
} from "../types.ts"

// type Result = undefined | void | Response

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  called = 0
  response: Result = (() => {})()

  constructor(public ctx: RequestContext, private toCall: Array<PromiseMiddleware>) {}

  static promisify = (fcn: Middleware): PromiseMiddleware => {
    return fcn.constructor.name === "AsyncFunction"
      ? fcn as PromiseMiddleware
      : (ctx: RequestContext, next: Next) => new Promise((res, rej) => {
        try { res(fcn(ctx, next)) } catch(e) { rej(e) }
      })
  }

  async run(fcn: PromiseMiddleware): Promise<Result> {
    if (!fcn) return

    try {
      const result = await fcn(this.ctx, async () => await this.run(this.toCall[++this.called]))
      if (result) this.response = result
      if (!this.response) await this.run(this.toCall[++this.called])
    } catch (error) {
      throw error
    }

    return this.response
  }

  async start() {
    await this.run(this.toCall[this.called])
    return this.response
  }
}
