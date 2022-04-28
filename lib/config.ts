import { Config, AnalyticsData } from "./types.ts"

const env = Deno.env.toObject()

let config: Config = {
    devMode: env.ENVIRONMENT !== "production",
    port: 7777,
    hostname: "0.0.0.0",
    defaultCacheLifetime: 3600,
    hotReloadDelay: 400,
    logHandler: async (log: string) => await console.log(log),
    analyticsHandler: async (data: AnalyticsData) => await console.log(JSON.stringify(data)),
    errorHandler: async (_request: Request, statusCode: number) => await new Promise((resolve, _reject) => {
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
        resolve(response);
    })
}
export const setConfig = (newConfObj: Partial<Config>) => config = { ...config, ...newConfObj }
export const getConfig = () => config;