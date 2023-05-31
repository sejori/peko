import { 
  Route, 
  ssrHandler, 
  cacher,
  ResponseCache
} from "../../mod.ts"
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server"

import HomePage from "./src/pages/Home.tsx"
import AboutPage from "./src/pages/About.tsx"
import htmlTemplate from "./src/template.ts"

const cache = new ResponseCache()
const env = Deno.env.toObject()

export const Index: Route = {
  path: "/",
  // use cacher to serve responses from cache in prod env
  middleware: env.ENVIRONMENT === "production" ? cacher(cache) : [],
  handler: ssrHandler(() => {
    const appHTML = renderToString(HomePage())
    return htmlTemplate({
      appHTML,
      title: `<title>Peko</title>`,
      modulepreload: `
        <script modulepreload="true" type="module" src="https://esm.sh/react-dom@18.2.0/client"></script>
        <script modulepreload="true" type="module" src="/pages/Home.tsx"></script>
      `,
      hydrationScript: `<script type="module">
        import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client";
        import Home from "/pages/Home.tsx";
        hydrateRoot(document.getElementById("root"), Home());
      </script>`
    })
  }, {
    headers: new Headers({
      // instruct browser to cache page in prod env
      "Cache-Control": env.ENVIRONMENT === "production"
        ? "max-age=86400, stale-while-revalidate=86400"
        : "no-store"
    }),
  })
}

export const About: Route = {
  path: "/about",
  middleware: [
    (ctx) => { 
      ctx.state = {
        request_time: `${Date.now()}`,
        DENO_REGION: Deno.env.get("DENO_REGION") || "localhost"
      }
    }
  ],
  handler: ssrHandler((ctx) => {
    const appHTML = renderToString(AboutPage(ctx.state))
    return htmlTemplate({
      appHTML,
      title: `<title>Peko | About</title>`,
      modulepreload: `
        <script modulepreload="true" type="module" src="https://esm.sh/react-dom@18.2.0/client"></script>
        <script modulepreload="true" type="module" src="/pages/About.tsx"></script>
      `,
      hydrationScript: `<script type="module">
        import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client";
        import About from "/pages/About.tsx";
        hydrateRoot(document.getElementById("root"), About(${JSON.stringify(ctx.state)}))
      </script>`
    })
  })
}