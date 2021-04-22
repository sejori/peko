import { connect } from "https://deno.land/x/redis/mod.ts"

import { log } from "./logger.js"
import { devMode, cacheLifespan } from "../../config.js"

// set up fallback in case cache is used when it shouldn't be!
const fallback = (method, key) => {
    // silent set in dev mode as this is expected behaviour in /lib/middlewares/sss.js
    if (devMode && method === 'set') return

    log(devMode 
        ? `Warning: attempt ${method} cache value with key ${key} in DEVELOPMENT mode. This does nothing!`
        : new Error(`attempt ${method} cache value with key ${key} in PRODUCTION mode but the Redis connection has failed!`)
    )
    return ''
}

let redis = {
    get: (key) => fallback('get', key),
    set: (key) => fallback('set', key)
}

// attempt to overwrite redis with Redis object via connect
if (!devMode && cacheLifespan > 0) try {
    redis = await connect({
        hostname: 'redis',
        port: 6379,
    })
} catch(e) { log(e) }

// export redis fcns with built in type handling (or fallbacks if something has gone wrong)
export const getCache = async (key) => {
    const value = await redis.get(key)
    const type = await redis.get(`${key}_type`)

    switch(type) {
        case 'object':
            return JSON.parse(value)
        case 'number':
            return Number(value)
        default:
            return value
    }
}

export const setCache = async (key, value) => {
    await redis.set(key, JSON.stringify(value))
    await redis.set(`${key}_type`, typeof value)
}