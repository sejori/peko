import { acceptable, acceptWebSocket } from "https://deno.land/std/ws/mod.ts"

import { log } from "../utils/logger.js"

export const devSocket = async (request) => {
    if (acceptable(request)) {
        acceptWebSocket({
            headers: request.headers,
            conn: request.conn,
            bufWriter: request.w,
            bufReader: request.r,
        })
            .then(async () => log("DevSocket connected - will trigger hot reload on connection close."))
            .catch(async (err) => {
                console.error(`failed to accept websocket: ${err}`)
                await request.respond({ status: 400 })
            })
    }
}