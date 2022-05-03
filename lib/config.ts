import { Config, RequestEvent } from "./types.ts"

const env = Deno.env.toObject()

let config: Config = {
    devMode: env.ENVIRONMENT !== "production",
    port: 7777,
    hostname: "0.0.0.0",
    defaultCacheLifetime: 3600,
    logString: (log: string) => console.log(log),
    logEvent: (data: RequestEvent) => console.log(JSON.stringify(data)),
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
export const setConfig = (newConfObj: Partial<Config>) => config = { ...config, ...newConfObj }
export const getConfig = () => config;