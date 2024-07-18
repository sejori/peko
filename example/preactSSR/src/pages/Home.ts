import { html } from "preact";

import Layout from "../components/Layout.ts";

const Home = () => {
  return html`
    <${Layout} navLink="about" navColor="#101727">
      <h2>Features</h2>
      <ul>
        <li>Simple and familiar syntax, supports any modern JS/TS environment.</li>
        <li>Library of request <a href="#handlers">handlers</a>, <a href="#middleware">middleware</a> and <a href="#utils">utils</a>.</li>
        <li>Cascades <a target="_blank" href="https://github.com/sebringrose/peko/blob/main/server.ts">Request Context</a> through middleware stack for data flow and post-response operations.</li>
        <li>100% TypeScript complete with tests.</li>
      </ul>

      <h2>Guides</h2>
      <ol>
        <li><a href="https://github.com/sebringrose/peko/blob/main/react.md">How to build a full-stack React application with Peko and Deno</a></li>
        <li>Want to build a lightweight HTML or Preact app? Check out the <a href="https://github.com/sebringrose/peko/blob/main/examples">examples</a>!</li>
      </ol>

      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div>
          <h2 id="handlers">Handlers</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/ssr.ts">Server-side render</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/file.ts">Static files</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/sse.ts">Server-sent events</a></li>
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
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/utils/Crypto.ts">Crypto - JWT/hashing</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/utils/Profiler.ts">Profiler</a></li>
          </ul>
        </div>
      </div>
    </${Layout}>
  `;
};

export default Home;
