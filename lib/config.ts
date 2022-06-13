import { RequestContext } from "./server.ts"

export type Config = { 
  devMode: boolean
  port: number
  hostname: string
  stringLogger: (log: string) => Promise<void> | void
  eventLogger: (data: Event) => Promise<void> | void
  errorHandler: (ctx: RequestContext, statusCode?: number, error?: Error | string | undefined) => Response | Promise<Response>
}

export const config: Config = {
  devMode: false,
  port: 7777,
  hostname: "0.0.0.0",
  stringLogger: (log: string) => console.log(log),
  eventLogger: (e: Event) => console.log(e),
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