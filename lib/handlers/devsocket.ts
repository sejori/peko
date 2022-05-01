import { acceptWebSocket } from "https://deno.land/std@0.95.0/ws/mod.ts"

import { getConfig } from "../config.ts"

const config = getConfig()

export const devSocketHandler = async (request: any) => {
    // TODO: what is the right type for request arg?
    const { conn, r: bufReader, w: bufWriter, headers } = request;
    try {
        await acceptWebSocket({
            headers: headers,
            conn: conn,
            bufWriter: bufReader,
            bufReader: bufWriter,
        })
        config.logHandler("DevSocket connected - will close and trigger hot reload in client on server restart.")
        return new Response("Devsocket connection succeeded", { status: 200 })
    } catch(e) {
        config.logHandler(`DevSocket connection failed: ${e}`)
        return new Response(`DevSocket connection failed: ${e}`, { status: 400 })
    }
}