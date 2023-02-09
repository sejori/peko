/**
 * Featherweight apps on Deno Deploy.
 */

// Core classes, functions & types
import Server from "./server.ts"
export default Server
export * from "./server.ts"

// Handlers
export * from "./handlers/static.ts"
export * from "./handlers/ssr.ts"
export * from "./handlers/sse.ts"

// Middlewares
export * from "./middleware/authenticator.ts"
export * from "./middleware/cacher.ts"
export * from "./middleware/logger.ts"

// Utils
export * from "./utils/Crypto.ts"
export * from "./utils/ResponseCache.ts"
export * from "./utils/Cascade.ts"
export * from "./utils/helpers.ts"