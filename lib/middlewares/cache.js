import { getCache } from "../utils/cacher.js"
import { cacheLifespan } from "../config.js"
import { log } from "../utils/logger.js"

export const cacheHandler = async (request, responder) => {
    const cacheRes = await getCache(request.url)
    const cacheDOB = await getCache(`${request.url}_DOB`)

    console.log('cacheRes', cacheRes)
    console.log('cacheDOB', cacheDOB)
    console.log('cacheLifespan', cacheLifespan)

    // do we have a cached response and is it valid?
    if (cacheRes && cacheDOB && cacheDOB + cacheLifespan > Date.now()) {
        log('we have a cache value!')
        return request.respond(cacheRes)
    }

    // if not, run default response middleware
    return responder()
}