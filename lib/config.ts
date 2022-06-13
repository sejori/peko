import { RequestContext } from "./server.ts"

export const config: Config = {
  devMode: false,
  port: 7777,
  hostname: "0.0.0.0",
  logString: (log: string) => console.log(log),
  logEvent: (e: Event) => console.log(e),
  errorHandler: (_ctx: RequestContext, statusCode?: number) => {
    let response;
    switch (statusCode) {
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
 * Update Peko internal config object
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

export type Config = { 
  devMode: boolean
  port: number
  hostname: string
  logString: LogString
  logEvent: LogEvent
  errorHandler: ErrorHandler
}
export type LogString = (log: string) => void | Promise<void>
export type LogEvent = (data: Event) => void | Promise<void>
export type ErrorHandler = (ctx: RequestContext, statusCode?: number, error?: Error | string | undefined) => Response | Promise<Response>