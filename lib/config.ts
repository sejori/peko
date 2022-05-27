import { Config, Event } from "./types.ts"

let config: Config = {
  devMode: false,
  port: 7777,
  hostname: "0.0.0.0",
  logString: (log: string) => console.log(log),
  logEvent: (e: Event) => console.log(e),
  errorHandler: (statusCode: number) => {
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
 * 
 * @param newConfigObj: Config
 */
export const setConfig = (newConfObj: Partial<Config>) => config = { ...config, ...newConfObj }

/**
 * 
 * @returns configObj: Config
 */
 export const getConfig = () => config