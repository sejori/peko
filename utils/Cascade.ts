import { RequestContext, Handler, Middleware } from "../server.ts"

type SafeMiddleware = (ctx: RequestContext, next: () => Promise<Response | void> | Response | void) => Promise<Response | void>
type Result = undefined | void | Response

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  called = 0
  response: Result

  constructor(public ctx: RequestContext, private toCall: Array<Middleware | Handler>) {}


  async run(fcn: Middleware): Promise<Result> {
    if (!fcn) return

    // TODO: refactor this into addRoute logic
    const fcnPromise: SafeMiddleware = fcn.constructor.name === "AsyncFunction"
      ? fcn as SafeMiddleware
      : (ctx, next) => new Promise((res, rej) => {
        try { res(fcn(ctx, next)) } catch(e) { rej(e) }
      })

    try {
      const result = await fcnPromise(this.ctx, async () => await this.run(this.toCall[++this.called]))
      if (!this.response && result) {
        this.response = result
      } else {
        await this.run(this.toCall[++this.called])
      }
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
