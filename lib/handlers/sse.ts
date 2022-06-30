import { RequestContext } from "../server.ts"
import { Event, Emitter } from "../utils/event.ts"
import { config } from "../config.ts"

const encoder = new TextEncoder()

/**
 * Peko Server-Sent Events handler. Streams Event data from provided Emitter to Response body.
 * @param sseData: SSERoute
 * @returns Promise<Response>
 */
export const sseHandler = (ctx: RequestContext, emitter: Emitter) => {
  let lexController: ReadableStreamDefaultController<any>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      config.logString(`Client ${ctx.request.headers.get("X-Forwarded-For")} connected`)
      lexController = controller
      emitter.subscribe(lexEnqueue)
    },
    cancel() {
      config.logString(`Client ${ctx.request.headers.get("X-Forwarded-For")} disconnected`)
      emitter.unsubscribe(lexEnqueue)
    }
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    }
  })
}