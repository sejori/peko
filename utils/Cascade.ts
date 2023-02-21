import { RequestContext, Middleware, PromiseMiddleware, Route } from "../server.ts"

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  response: Response | undefined
  called = 0
  toCall: PromiseMiddleware[]

  constructor(public ctx: RequestContext, private route?: Route) {
    this.toCall = this.route
      ? [...this.ctx.server.middleware, ...this.route.middleware as PromiseMiddleware[], this.route.handler as PromiseMiddleware]
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
