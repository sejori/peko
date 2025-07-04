import { Handler, RequestContext, file } from "../../../mod.ts";

export const githubHandler =
  (path: string, type?: string): Handler =>
  async (ctx: RequestContext<{ env?: { ENVIRONMENT: string } }>) => {
    const base =
      ctx.state.env?.ENVIRONMENT === "production" || !import.meta.url
        ? `https://raw.githubusercontent.com/sejori/peko/main/example/reactSSR/`
        : import.meta.url.replace("handlers/github.handler.ts", "");

    return (
      await file(new URL(`${base}${path}`), {
        headers: new Headers({
          ...(type && { "Content-Type": type }),
          // instruct browser to cache file in prod env
          "Cache-Control":
            ctx.state.env?.ENVIRONMENT === "production"
              ? "max-age=86400, stale-while-revalidate=86400"
              : "no-store",
        }),
      })
    )(ctx);
  };
