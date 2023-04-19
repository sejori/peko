import { Handler, HandlerOptions } from "../types.ts"

/**
 * Upgrades requests with "upgrade: websocket" header to WebSocket connection.
 * Streams type "send" CustomEvents from provided EventTarget to client.
 * Dispatches received MessageEvents to provided EventTarget.
 * Routes using this handler should be requested via the WebSocket browser API. 
 * @param target: EventTarget
 * @param opts: (optional) HandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const wsHandler = (socketCallback: (s: WebSocket) => unknown, opts: HandlerOptions = {}): Handler => (ctx) => {
  const { request } = ctx
  const conn = request.headers.get("connection") || "";
  const upgrade = request.headers.get("upgrade") || "";
  if (!conn.toLowerCase().includes("upgrade") || upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(request);
  socketCallback(socket)

  if (opts.headers) for (const header of opts.headers) {
    response.headers.append(header[0], header[1])
  }

  return response
}