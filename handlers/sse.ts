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
  let lexController: ReadableStreamDefaultController<unknown>
  const lexEnqueue = (data: CustomEvent) => lexController.enqueue(
    encoder.encode(
      `data: ${JSON.stringify({ timeStamp: data.timeStamp, detail: data.detail })}\n\n`
    )
  )

  const body = new ReadableStream({
    start(controller) {
      lexController = controller
      target.addEventListener("data", (e: Event) => lexEnqueue(e as CustomEvent))
    },
    cancel() {
      target.removeEventListener("data", (e: Event) => lexEnqueue(e as CustomEvent))
    }
  })

  const headers = new Headers({
    "Content-Type": "text/event-stream",
  })
  if (opts.headers) mergeHeaders(headers, opts.headers)

  return new Response(body, { headers })
}