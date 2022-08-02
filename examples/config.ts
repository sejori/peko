import { logger } from "../mod.ts"

const env = Deno.env.toObject()

const config = {
  // set devMode true to disable browser & server caching
  devMode: env.ENVIRONMENT !== "production",
  globalMiddleware: [
    logger
  ],
  // eventLogger: () => {}, // <-- ingore event logs for clean shell
}

export default config