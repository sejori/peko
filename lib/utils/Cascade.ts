import { RequestContext } from "../Router.ts"
import { Middleware, Result, Next } from "../types.ts"

export type PromiseMiddleware = (ctx: RequestContext, next: Next) => Promise<Result>

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  _response: Response | undefined
  called = 0

  get response(): Response {
    return this._response
      ? this._response
      : new Response("", { status: 404 })
  }

  constructor(public ctx: RequestContext, public middleware: Middleware[]) {}

  static promisify = (fcn: Middleware): PromiseMiddleware => {
    return fcn.constructor.name === "AsyncFunction"
      ? fcn as PromiseMiddleware
      : (ctx, next) => new Promise((res, rej) => {
        try { res(fcn(ctx, next)) } catch(e) { rej(e) }
      })
  }

  async run(): Promise<Response> {
    console.log("cascade mware: ", this.middleware)
    if (!this.middleware[this.called]) return this.response

    try {
      const response = await this.middleware[this.called](this.ctx, async () => {
        this.called++
        return await this.run()
      })

      if (response) this._response = response
      if (!this.response) {
        this.called++
        await this.run()
      }
    } catch (error) {
      throw error
    }

    return this.response
  }
}
