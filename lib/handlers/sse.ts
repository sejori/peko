import { SSERoute, Event } from "../types.ts"
import { getConfig } from "../config.ts"

const encoder = new TextEncoder()

/**
 * SSE connection handler
 * 
 * @param sseData: SSERoute
 * @returns Promise<Response>
 */
export const sseHandler = (sseData: SSERoute, request: Request) => {
  const config = getConfig()
  let lexController: ReadableStreamDefaultController<any>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      config.logString(`Client ${request.headers.get("X-Forwarded-For")} connected`)
      lexController = controller
      sseData.emitter.subscribe(lexEnqueue)
    },
    cancel() {
      config.logString(`Client ${request.headers.get("X-Forwarded-For")} disconnected`)
      sseData.emitter.unsubscribe(lexEnqueue)
    }
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    }
  })
}