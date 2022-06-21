import { RequestContext } from "./server.ts"
import { Event } from "./utils/emitter.ts"

export interface Config { 
  devMode: boolean
  port: number
  hostname: string
  logString: (log: string) => Promise<void> | void
  logEvent: (data: Event) => Promise<void> | void
  handleError: (ctx: RequestContext, statusCode?: number, error?: Error | string | undefined) => Response | Promise<Response>
}

export const config: Config = {
  devMode: false,
  port: 7777,
  hostname: "0.0.0.0",
  logString: (log: string) => console.log(log),
  logEvent: (e: Event) => console.log(e),
  handleError: (_ctx: RequestContext, statusCode?: number) => {
    let response;
    switch (statusCode) {
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