import { RequestContext, Route, sse } from "../../../index.ts";

const demoEventTarget = new EventTarget();

export const APIs: Route[] = [
  {
    path: "/sse",
    handler: (ctx: RequestContext) => {
      setInterval(() => {
        demoEventTarget.dispatchEvent(
          new CustomEvent("send", { detail: Math.random() })
        );
      }, 2500);

      return sse(demoEventTarget)(ctx);
    },
  },
  {
    path: "/api/parrot",
    method: "POST",
    handler: async (ctx: RequestContext) => {
      const body = await ctx.request.text();
      return new Response(`Parrot sqwarks: ${body}`);
    },
  },
];

export default APIs;
