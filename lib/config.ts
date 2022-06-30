import { RequestContext, Middleware } from "./server.ts"
import { Event } from "./utils/event.ts"
import { logger } from "./middlewares/logger.ts"

export interface Config { 
  devMode: boolean
  port: number
  hostname: string
  globalMiddleware: Middleware[]
  logString: (log: string) => Promise<void> | void
  logEvent: (data: Event) => Promise<void> | void
  handleError: (ctx: RequestContext, error?: Error | string) => Response | Promise<Response>
}

/**
 * Peko's default config
 */
export const config: Config = {
  devMode: false,
  port: 7777,
  hostname: "0.0.0.0",
  globalMiddleware: [
    logger
  ],
  logString: (log: string) => console.log(log),
  logEvent: (e: Event) => console.log(e),
  handleError: (ctx: RequestContext) => {
    let response;
    switch (ctx.state.status) {
      case 401: 
      response = new Response("401: Unauthorized!", {
        headers: new Headers(),
        status: 401
      })
      break
      case 404: 
        response = new Response("404: Nothing found here!", {
          headers: new Headers(),
          status: 404
        })
        break
      default:
        response = new Response("500: Internal Server Error!", {
          headers: new Headers(),
          status: 500
        })
        break
    }
    return response;
  }
}

/**
 * Update Peko config
 * 
 * @param newConfigObj: Config
 */
export const setConfig = (newConfObj: Partial<Config>) => {
  for (const key in newConfObj) {
    Object.defineProperty(config, key, {
      value: newConfObj[key as keyof typeof config]
    })
  }
}