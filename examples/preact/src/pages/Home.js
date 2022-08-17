import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../layouts/Layout.js"

const Home = (props) => {
  return html`
    <${Layout} navColor="limegreen">
      <h1 style="text-align: center;">Peko</h1>
      <p style="text-align: center;"><strong>
        Featherweight server framework and utility library for full-stack stateless apps<br/>🐓 on <a href="https://deno.com/deploy">Deno Deploy</a> 🦕
      </strong></p>

      <div style="width: 100%; display: flex; justify-content: space-around;">
        <p><a href="https://github.com/sebringrose/peko">GITHUB REPO</a></p>
        <p><a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">API DOCS</a></p>
      </div>

      <p>Time of server request: <strong>${props.server_time}</strong></p>
      <p>Time of latest render: <strong>${Date.now()}</strong> ${"<"}- changes with hydration!</p>

      <h2>Features</h2>
      <ul>
        <li>Simple routing and error handling.</li>
        <li>Server-Side Render, Server-Sent Event & Static asset request handlers.</li>
        <li>Logging, Emitting, Caching, and Authenticating utilities and middleware.</li>
        <li>Cascading middleware for efficient chaining and post-response operations.</li>
        <li>100% TypeScript complete with tests.</li>
      </ul>
    </${Layout}>
  `
}

export default Home