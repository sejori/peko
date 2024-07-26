import { renderToString } from "react-dom/server";
import { Handler, RequestContext, ssr } from "../../../mod.ts";
import htmlTemplate from "../src/document.ts";

export const reactHandler =
  (
    component: (props: Record<string, unknown>) => unknown,
    title: string,
    entrypoint: string
  ): Handler =>
  (ctx: RequestContext<{ env?: { ENVIRONMENT: string } }>) => {
    return ssr(
      () => {
        const ssrHTML = renderToString(component(ctx.state), null);
        return htmlTemplate({
          title,
          ssrHTML,
          entrypoint,
          serverState: ctx.state,
        });
      },
      {
        headers: new Headers({
          // instruct browser to cache page in prod env
          "Cache-Control":
            ctx.state.env?.ENVIRONMENT === "production"
              ? "max-age=86400, stale-while-revalidate=86400"
              : "no-store",
        }),
      }
    )(ctx);
  };
