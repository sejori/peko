import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../layouts/Layout.js"

const Home = (props) => {
  return html`
    <${Layout} navColor="limegreen">
      <h1 style="text-align: center;">Peko</h1>
      <p style="text-align: center;"><strong>
        🪶 Featherweight toolkit for the modern stateless web. Built with Deno. 🦕 
      </strong></p>

      <p style="text-align: center;">
        Serve the world easily with <a href="https://deno.com/deploy">Deno Deploy</a>! 🌏
      </p> 

      <div style="width: 100%; display: flex; justify-content: space-around;">
        <p><a href="https://github.com/sebringrose/peko">GITHUB REPO</a></p>
        <p><a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">API DOCS</a></p>
      </div>

      <p>Time of server request: <strong>${props.server_time}</strong></p>
      <p>Time of latest render: <strong>${Date.now()}</strong> ${"<"}- changes with hydration!</p>

      <h2>Summary</h2>
      <ul>
        <li><strong>First-class frontend</strong> - Server-side render then client-side hydrate with the same code. Bundling optional.</li>
        <li><strong>Production-ready backend</strong> - TypeScript, Response caching (and security checks in devMove coming soon).</li>
        <li><strong>Software Minimalism</strong> - No building. Sleek runtime using only the Deno std library.</li>
        <li><strong>Ease of Adoption</strong> - Familiar API and no enforced front-end tooling or project structure.</li>
      </ul>
    </${Layout}>
  `
}

export default Home