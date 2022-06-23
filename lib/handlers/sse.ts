import { addRoute, RequestContext, Middleware } from "../server.ts"
import { Event, Emitter } from "../utils/event.ts"
import { config } from "../config.ts"

const encoder = new TextEncoder()

export type SSERoute = {
  route: string
  middleware?: Middleware[] | Middleware
  emitter: Emitter
}

/**
 * SSE connection handler
 * 
 * @param sseData: SSERoute
 * @returns Promise<Response>
 */
export const sseHandler = (ctx: RequestContext, sseData: SSERoute) => {
  let lexController: ReadableStreamDefaultController<any>
  const lexEnqueue = (event: Event) => lexController.enqueue(encoder.encode(`data: ${JSON.stringify(event.data)}\n\n`))

  const body = new ReadableStream({
    start(controller) {
      config.logString(`Client ${ctx.request.headers.get("X-Forwarded-For")} connected`)
      lexController = controller
      sseData.emitter.subscribe(lexEnqueue)
    },
    cancel() {
      config.logString(`Client ${ctx.request.headers.get("X-Forwarded-For")} disconnected`)
      sseData.emitter.unsubscribe(lexEnqueue)
    }
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    }
  })
}

/**
 * Add an SSERoute
 * 
 * @param sseRouteData { 
    route: string - e.g. "favicon.png"
    emitter: Emitter - Peko's internal event subscription interface
 * }
 */
export const addSSERoute = (sseData: SSERoute) => {
  return addRoute({
    route: sseData.route,
    method: "GET",
    middleware: sseData.middleware,
    handler: async (ctx) => await sseHandler(ctx, sseData)
  })
}