/**
 * Featherweight apps on the edge
 */

// Core classes, functions & types
export * from "./lib/Router.ts";
export * from "./lib/types.ts";

// Handlers
export * from "./lib/handlers/file.ts";
export * from "./lib/handlers/sse.ts";
export * from "./lib/handlers/ssr.ts";

// Middlewares
export * from "./lib/middleware/authenticator.ts";
export * from "./lib/middleware/cacher.ts";
export * from "./lib/middleware/logger.ts";

// Utils
export * from "./lib/utils/CacheItem.ts";
export * from "./lib/utils/Cascade.ts";
export * from "./lib/utils/Crypto.ts";
export * from "./lib/utils/helpers.ts";
export * from "./lib/utils/Profiler.ts";

import { Router } from "./lib/Router.ts";
export default Router;
