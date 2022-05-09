/**
 * The Featherweight Deno Library for Modern JS Apps.
 */

export { start, addRoute, addStaticRoute, addSSRRoute } from "./lib/server.ts"
export { getConfig, setConfig } from "./lib/config.ts"
export { staticHandler } from "./lib/handlers/static.ts"
export { ssrHandler } from "./lib/handlers/ssr.ts"

export { logRequest } from "./lib/utils/logger.ts"
export { createResponseCache } from "./lib/utils/cacher.ts"
