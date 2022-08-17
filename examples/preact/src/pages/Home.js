import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact"

import Layout from "../layouts/Layout.js"

const Home = (props) => {
  return html`
    <${Layout} navColor="forestgreen">
      <h1 style="text-align: center;">Peko</h1>
      <p style="text-align: center;"><strong>
        Featherweight server framework and utility library for full-stack stateless apps<br/>🐓 on <a href="https://deno.com/deploy">Deno Deploy</a> 🦕
      </strong></p>

      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <p>Server request: <strong>${props.server_time}</strong></p>
        <p>Client hydration: <strong>${Date.now()}</strong></p>
      </div>

      <h2>Features</h2>
      <ul>
        <li>Simple routing and error handling.</li>
        <li>Server-Side Render, Server-Sent Event & Static asset request handlers.</li>
        <li>Logging, Emitting, Caching, and Authenticating utilities and middleware.</li>
        <li>Cascading middleware for efficient chaining and post-response operations.</li>
        <li>100% TypeScript complete with tests.</li>
      </ul>

      <div style="width: 100%; display: flex; justify-content: space-around;">
      <div>
        <img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" height=100 alt=GitHub />
        <p style="text-align: center"><a href="https://github.com/sebringrose/peko">REPOSITORY</a></p>
      </div>
      <div>
        <img src="https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg" height=100 alt=Deno />
        <p style="text-align: center"><a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">DOCS</a></p>
      </div>
    </div>

    </${Layout}>
  `
}

export default Home