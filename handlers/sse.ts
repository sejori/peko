import { Handler, HandlerOptions } from "../server.ts"
import { Emitter } from "../utils/Emitter.ts"
import { mergeHeaders } from "../utils/helpers.ts"

const encoder = new TextEncoder()

/**
 * Streams Event data from provided Emitter to Response body
 * @param emitter: Emitter
 * @param opts: (optional) HandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const sseHandler = (emitter: Emitter, opts?: HandlerOptions): Handler => () => {
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (data: unknown) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      emitter.subscribe(lexEnqueue)
    },
    cancel() {
      emitter.unsubscribe(lexEnqueue)
    }
  })

  const headers = new Headers({
    "Content-Type": "text/event-stream",
  })
  if (opts?.headers) mergeHeaders(headers, opts.headers)

  return new Response(body, { headers })
}