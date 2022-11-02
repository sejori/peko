import { RequestContext, Handler } from "../server.ts"
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
export const sseHandler = (sseData: SSEData): Handler => () => {
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (data: unknown) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      sseData.emitter.subscribe(lexEnqueue)
    },
    cancel() {
      sseData.emitter.unsubscribe(lexEnqueue)
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