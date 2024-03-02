import { mergeHeaders } from "../utils/helpers.ts";
import { Handler, HandlerOptions } from "../types.ts";

const encoder = new TextEncoder();

/**
 * Streams type "send" CustomEvents from provided EventTarget to Response body.
 * Routes using this handler should be requested via the EventSource browser API.
 * @param target: EventTarget
 * @param opts: (optional) HandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const sse = (
  target: EventTarget,
  opts: HandlerOptions = {}
): Handler => {
  return function SseHandler() {
    let lexicalController: ReadableStreamDefaultController<unknown>;
    const enqueueEvent = (e: Event) => {
      lexicalController.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            timeStamp: e.timeStamp,
            detail: (e as CustomEvent).detail,
          })}\n\n`
        )
      );
    };

    const body = new ReadableStream({
      start(controller) {
        lexicalController = controller;
        target.addEventListener("send", enqueueEvent);
      },
      cancel() {
        target.removeEventListener("send", enqueueEvent);
      },
    });

    const headers = new Headers({
      "Content-Type": "text/event-stream",
    });
    if (opts.headers) mergeHeaders(headers, opts.headers);

    return new Response(body, { headers });
  };
};
