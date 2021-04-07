import { acceptable, acceptWebSocket } from "https://deno.land/std/ws/mod.ts"

import { srcDir } from "../config.js"
import { log } from "../utils/logger.js"
import { watcherUrl } from "../utils/watcher.js"

export const devSocket = async (request) => {
    if (acceptable(request)) {
        acceptWebSocket({
            headers: request.headers,
            conn: request.conn,
            bufWriter: request.w,
            bufReader: request.r,
        })
            .then(async (sock) => {
                let closed = false
                const worker = new Worker(new URL(watcherUrl, import.meta.url).href, { 
                    type: "module", 
                    deno: { namespace: true }
                })

                log("DevSocket connected - will notify browser client of file changes for hot reloading.")
                worker.postMessage({ srcDir })
                worker.addEventListener('message', async (message) => {
                    if (!closed) {
                        await sock.send("src updated - hot reload now")
                        await sock.close()
                        closed = true
                    }
                })
            })
            .catch(async (err) => {
                console.error(`failed to accept websocket: ${err}`)
                await request.respond({ status: 400 })
            })
    }
}