import { RequestContext } from "../Server.ts"
import { Middleware, Result, Next } from "../types.ts"

export type PromiseMiddleware = (ctx: RequestContext, next: Next) => Promise<Result>

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  response: Response | undefined
  called = 0
  toCall: PromiseMiddleware[]

  constructor(public ctx: RequestContext) {
    this.toCall = this.ctx.route
      ? [...this.ctx.server.middleware, ...this.ctx.route.middleware as PromiseMiddleware[], this.ctx.route.handler as PromiseMiddleware]
      : [...this.ctx.server.middleware]
  }

  static promisify = (fcn: Middleware): PromiseMiddleware => {
    return fcn.constructor.name === "AsyncFunction"
      ? fcn as PromiseMiddleware
      : (ctx, next) => new Promise((res, rej) => {
        try { res(fcn(ctx, next)) } catch(e) { rej(e) }
      })
  }

  async run(fcn: PromiseMiddleware): Promise<Response | undefined> {
    if (!fcn) return this.response

    try {
      const response = await fcn(this.ctx, async () => await this.run(this.toCall[++this.called]))
      if (response) this.response = response
      if (!this.response) await this.run(this.toCall[++this.called])
    } catch (error) {
      throw error
    }

    return this.response
  }

  async start() {
    await this.run(this.toCall[this.called])
    return this.response
      ? this.response
      : new Response("", { status: 404 })
  }
}
