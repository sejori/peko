import { PekoConfig, PekoLogData } from "./types.ts"

const env = Deno.env.toObject()

let config: PekoConfig = {
    devMode: env.ENVIRONMENT !== "production",
    port: 7777,
    hostname: "0.0.0.0",
    defaultCacheLifetime: 3600,
    hotReloadDelay: 400,
    logHandler: (log: string) => console.log(log),
    requestDataHandler: (data: PekoLogData) => console.log(JSON.stringify(data)),
    error404Response: new Response("404: Nothing found here!", {
        headers: new Headers(),
        status: 404
    }),
    error500Response: new Response("500: Internal Server Error!", {
        headers: new Headers(),
        status: 500
    })
}
export const setConfig = (newConfObj: PekoConfig) => config = { ...config, ...newConfObj }
export const getConfig = () => config;