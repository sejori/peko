import { RequestContext } from "../server.ts"
import { Event, Emitter } from "../utils/event.ts"
import { config } from "../config.ts"

export type SSEData = {
  emitter: Emitter
}
const encoder = new TextEncoder()

/**
 * Peko Server-Sent Events handler. Streams Event data from provided Emitter to Response body.
 * @param ctx: 
 * @returns Promise<Response>
 */
export const sseHandler = (ctx: RequestContext, sseData: SSEData) => {
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      config.logString(`Client ${ctx.request.headers.get("X-Forwarded-For")} connected`)
      lexController = controller
      sseData.emitter.subscribe(lexEnqueue)
    },
    cancel() {
      config.logString(`Client ${ctx.request.headers.get("X-Forwarded-For")} disconnected`)
      sseData.emitter.unsubscribe(lexEnqueue)
    }
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    }
  })
}