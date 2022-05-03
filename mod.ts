/**
 * The Featherweight Deno Library for Modern JS Apps.
 */

export { start, addRoute, addStaticRoute, addSSRRoute } from "./lib/server.ts"
export { getConfig, setConfig } from "./lib/config.ts"
export { ssrHandler, staticHandler } from "./lib/handlers/index.ts"
