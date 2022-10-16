import { Event, RequestContext, Handler } from "../server.ts"
import { Emitter } from "../utils/Emitter.ts"

const encoder = new TextEncoder()

export type SSEData = { 
  emitter: Emitter
  headers?: Headers
}

/**
 * Streams Event data from provided Emitter to Response body
 * @param sseData: SSEData
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const sseHandler = (sseData: SSEData): Handler => (ctx: RequestContext) => {
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      sseData.emitter.subscribe(lexEnqueue)
      ctx.server.logEvent({
        id: "SSE-CONNECT",
        type: "request",
        data: { ctx },
        date: new Date()
      })
    },
    cancel() {
      sseData.emitter.unsubscribe(lexEnqueue)
      ctx.server.logEvent({
        id: "SSE-DISCONNECT",
        type: "request",
        data: { ctx },
        date: new Date()
      })
    }
  })

  const headers = new Headers({
    "Content-Type": "text/event-stream",
  })

  if (sseData.headers) {
    for (const pair of sseData.headers.entries()) {
      headers.append(pair[0], pair[1])
    }
  }

  return new Response(body, { headers })
}