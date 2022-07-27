/**
 * Featherweight toolkit for the modern stateless web. Built with Deno.
 */

// Core classes, functions & types
import PekoServer from "./server.ts"
export default PekoServer
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
export * from "./utils/ResponseCache.ts"
// export * from "./utils/Cascade.ts" // <-- not likely to be needed by users & clutters docs
export * from "./utils/Emitter.ts"
export * from "./utils/Crypto.ts"
// export * from "./utils/Promisify.ts" // <-- not likely to be needed by users & clutters docs
