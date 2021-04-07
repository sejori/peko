import { connect } from "https://deno.land/x/redis/mod.ts"

import { cacheLifespan } from "../config.js"

const redis = await connect({
    hostname: "redis",
    port: 6379,
})

export const useCache = async (request, responder) => {
    const cacheRes = await redis.get(request.url)
    const cacheAge = Number(redis.get(`${request.url}_date`))

    console.log(cacheRes)
    console.log(cacheAge)
    console.log(cacheLifespan)

    // do we have a cached response and is it valid?
    if (cacheRes && cacheAge && cacheAge + cacheLifespan > Date.now()) return request.respond(cacheRes)

    const freshRes = await createResponse()
    console.log(freshRes)

    return freshRes
}