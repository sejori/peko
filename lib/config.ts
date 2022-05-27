import { Config, Event } from "./types.ts"

const env = Deno.env.toObject()

let config: Config = {
    devMode: env.ENVIRONMENT !== "production",
    port: 7777,
    hostname: "0.0.0.0",
    defaultCacheLifetime: 10000, // <- 10 seconds
    logString: (log: string) => console.log(log),
    logEvent: (e: Event) => console.log(JSON.stringify(e)),
    errorHandler: (statusCode: number) => {
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
            case 500: 
                response = new Response("500: Internal Server Error!", {
                    headers: new Headers(),
                    status: 500
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