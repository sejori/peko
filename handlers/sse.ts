import { Event, RequestContext } from "../server.ts"
import { Emitter } from "../utils/Emitter.ts"

export type SSEData = {
  emitter: Emitter
}
const encoder = new TextEncoder()

/**
 * Streams Event data from provided Emitter to Response body
 * @param ctx: 
 * @returns Promise<Response>
 */
export const sseHandler = (ctx: RequestContext, sseData: SSEData) => {
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      sseData.emitter.subscribe(lexEnqueue)
      ctx.server.logEvent({
        id: "SSE-CONNECT",
        type: "request",
        data: { ipAddress: ctx.request.headers.get("X-Forwarded-For") },
        date: new Date()
      })
    },
    cancel() {
      sseData.emitter.unsubscribe(lexEnqueue)
      ctx.server.logEvent({
        id: "SSE-DISCONNECT",
        type: "request",
        data: { ipAddress: ctx.request.headers.get("X-Forwarded-For") },
        date: new Date()
      })
    }
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    }
  })
}