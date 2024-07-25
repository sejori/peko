import { Handler, file } from "../../../mod.ts";

const base = `https://raw.githubusercontent.com/sejori/peko/main/example/reactSSR/`;

export const githubHandler =
  (path: string, type?: string): Handler =>
  async (ctx) =>
    (
      await file(
        ctx.state.env.ENVIRONMENT === "production"
          ? new URL(`${base}${path}`)
          : new URL(".." + path, import.meta.url),
        {
          headers: new Headers({
            ...(type && { "Content-Type": type }),
            // instruct browser to cache file in prod env
            "Cache-Control":
              ctx.state.env.ENVIRONMENT === "production"
                ? "max-age=86400, stale-while-revalidate=86400"
                : "no-store",
          }),
        }
      )
    )(ctx);
