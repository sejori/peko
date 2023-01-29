import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../components/Layout.js"

const Home = () => {
  return html`
    <${Layout} navLink="about" navColor="forestgreen">
      <h2>Features</h2>
      <ul>
        <li>Simple and familiar syntax, built on top of Deno's <a href="https://deno.land/std/http/server.ts?s=Server">std/http</a>.</li>
        <li>Library of request <a href="#handlers">handlers</a>, <a href="#middleware">middleware</a> and <a href="#utils">utils</a>.</li>
        <li>Cascades <a target="_blank" href="https://github.com/sebringrose/peko/blob/main/server.ts">Request Context</a> through middleware stack for data flow and post-response operations.</li>
        <li>100% TypeScript complete with tests.</li>
      </ul>

      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div>
          <h2 id="handlers">Handlers</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/ssr.ts">Server-side render</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/static.ts">Static assets</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/sse.ts">Server-sent events</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/ws.ts">WebSockets</a></li>
          </ul>
        </div>

        <div>
          <h2 id="middleware">Middleware</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/authenticator.ts">JWT verifying</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/cacher.ts">Response caching</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/logger.ts">Request logging</a></li>
          </ul>
        </div>

        <div>
          <h2 id="utils">Utils</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/Crypto.ts">Crypto - JWT/hashing</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/ResponseCache.ts">Response cache</a></li>
          </ul>
        </div>
      </div>
    </${Layout}>
  `
}

export default Home