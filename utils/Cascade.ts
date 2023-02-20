import { RequestContext, PromiseMiddleware, Route } from "../server.ts"

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  response: Response = new Response("", { status: 404 })
  result: Response | undefined
  called = 0
  toCall: PromiseMiddleware[]

  constructor(public ctx: RequestContext, private route?: Route) {
    this.toCall = this.route
      ? [...this.ctx.server.middleware, ...this.route.middleware as PromiseMiddleware[], this.route.handler as PromiseMiddleware]
      : [...this.ctx.server.middleware]
  }

  async run(fcn: PromiseMiddleware): Promise<Response> {
    try {
      const response = await fcn(this.ctx, async () => await this.run(this.toCall[++this.called]))
      if (response) this.response = response
      if (this.response.status === 404) await this.run(this.toCall[++this.called])
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
