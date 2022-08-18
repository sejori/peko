import { logger } from "../mod.ts"

const env = Deno.env.toObject()

const config = {
  // set devMode true to disable caching in cacher middleware and set 
  // cache-control response headers to no-store in Static and SSR handlers
  devMode: env.ENVIRONMENT === "production" ? false : true,
  globalMiddleware: [
    logger
  ],
  // eventLogger: () => {}, // <-- ingore event logs for clean shell
}

export default config