import { acceptable, acceptWebSocket } from "https://deno.land/std/ws/mod.ts"

import { getConfig } from "../config.ts"

const config = getConfig()

export const devSocket = async (request: Request) => {
    if (acceptable(request)) {
        // TODO: what is the right type for request arg?
        const { conn, r: bufReader, w: bufWriter, headers } = request;
        try {
            await acceptWebSocket({
                headers: headers,
                conn: conn,
                bufWriter: bufReader,
                bufReader: bufWriter,
            })
        } catch(e) {
            config.logHandler(`failed to accept websocket: ${e}`)
            return new Response("Devsocket connection failed", { status: 400 })
        }

        config.logHandler("DevSocket connected - will trigger hot reload on connection close.")
    }

    return new Response()
}