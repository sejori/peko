import { Event, RequestContext, Handler } from "../server.ts"
import { Emitter } from "../utils/Emitter.ts"

const encoder = new TextEncoder()

/**
 * Streams Event data from provided Emitter to Response body
 * @param emitter: Emitter
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const sseHandler = (emitter: Emitter): Handler => (ctx: RequestContext) => {
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      emitter.subscribe(lexEnqueue)
      ctx.server.logEvent({
        id: "SSE-CONNECT",
        type: "request",
        data: { ctx },
        date: new Date()
      })
    },
    cancel() {
      emitter.unsubscribe(lexEnqueue)
      ctx.server.logEvent({
        id: "SSE-DISCONNECT",
        type: "request",
        data: { ctx },
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