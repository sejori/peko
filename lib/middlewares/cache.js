import { getCache } from "../utils/cacher.js"
import { cacheLifespan } from "../config.js"
import { log } from "../utils/logger.js"

export const cacheHandler = async (request, responder) => {
    const cacheRes = await getCache(request.url)
    const cacheResDOB = await getCache(`${request.url}_DOB`)

    // do we have a cached response and is it valid?
    if (cacheRes && cacheResDOB && cacheResDOB + cacheLifespan > Date.now()) {
        const headers = new Headers(cacheRes.headers)
        const body = cacheRes.body
    
        log('Serving cached response.')
        return request.respond({
            headers,
            body
        })
    }

    // if not, run default response middleware
    log('Cached response invalid, processing new response.')
    return responder()
}