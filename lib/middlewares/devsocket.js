import { acceptable, acceptWebSocket } from "https://deno.land/std/ws/mod.ts"

export const devSocket = async (request) => {
    if (acceptable(request)) {
        acceptWebSocket({
          headers: req.headers,
          conn: req.conn,
          bufWriter: req.w,
          bufReader: req.r,
        }).then(async (sock) => {
            console.log("DevSocket connected - will notify browser client of file changes for hot reloading.")
            const worker = new Worker(new URL("../utils/watcher.js", import.meta.url).href, { 
                type: "module", 
                deno: { namespace: true }
            })
            worker.postMessage({ srcDir })
            worker.addEventListener('message', async message => {
                console.log(message)
                await sock.send(message)
                await sock.close()
            })
        })
    }
}