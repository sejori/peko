import { Handler, HandlerOptions } from "../server.ts"
import { mergeHeaders } from "../utils/helpers.ts"

const encoder = new TextEncoder()

/**
 * Streams "data" events from provided EventTarget to Response body. Call Response.body.cancel() to end.
 * @param target: EventTarget
 * @param opts: (optional) HandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const sseHandler = (target: EventTarget, opts: HandlerOptions = {}): Handler => () => {
  let lexicalController: ReadableStreamDefaultController<unknown>
  const enqueueEvent = (e: Event) => {
    lexicalController.enqueue(encoder.encode(
      `data: ${JSON.stringify({ 
        timeStamp: e.timeStamp, 
        detail: (e as CustomEvent).detail 
      })}\n\n`
    ))
  }
  
  const body = new ReadableStream({
    start(controller) {
      lexicalController = controller
      target.addEventListener("send", enqueueEvent)
    },
    cancel() {
      target.removeEventListener("send", enqueueEvent)
    }
  })

  const headers = new Headers({
    "Content-Type": "text/event-stream",
  })
  if (opts.headers) mergeHeaders(headers, opts.headers)

  return new Response(body, { headers })
}