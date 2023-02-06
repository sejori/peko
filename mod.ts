/**
 * Featherweight toolkit for the modern stateless web. Built for Deno Deploy.
 */

// Core classes, functions & types
import Server from "./server.ts"
export default Server
export * from "./server.ts"

// Router alias for traditional Router setup
export { Server as Router }

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