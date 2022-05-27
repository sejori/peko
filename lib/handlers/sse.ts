import { SSERoute } from "../types.ts"
import { getConfig } from "../config.ts"

const encode = new TextEncoder().encode

/**
 * SSE connection handler
 * 
 * @param sseData: SSERoute
 * @returns Promise<Response>
 */
export const sseHandler = (sseData: SSERoute, request: Request) => {
  const config = getConfig()
  let lexController: ReadableStreamDefaultController<any>

  config.logString(`Client ${request.headers.get("X-Forwarded-For")} connected`)

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      sseData.emitter.subscribe(event => 
        lexController.enqueue(encode(`data: ${JSON.stringify(event.data)}`))
      )
    },
    cancel() {
      config.logString(`Client ${request.headers.get("X-Forwarded-For")} disconnected`)
      sseData.emitter.unsubscribe(event => 
        lexController.enqueue(encode(`data: ${JSON.stringify(event.data)}`))
      )
    }
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    }
  })
}