import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../components/Layout.js"

const Home = (props) => {
  return html`
    <${Layout} navColor="forestgreen">
      <h1 style="text-align: center;">Peko</h1>
      <p style="text-align: center;">
        Webserver framework and utility library for full-stack apps on the <a href="https://deno.com/deploy">stateless edge</a> 🐣<br/>
      </p>

      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <p style="margin:5px"><strong>Request time:</strong> ${props.request_time}</p>
        <p style="margin:5px"><strong>Hydration time:</strong> ${Date.now()}</p>
        <p style="margin:5px"><strong>Served from:</strong> ${props.DENO_REGION ? props.DENO_REGION : "localhost"}</p>
      </div>

      <!-- TODO: add input for parrot API route -->

      <h2>Features</h2>
      <ul>
        <li>Simple routing and error handling.</li>
        <li>Server-side render, server-sent event & static asset request handlers.</li>
        <li>Logging, emitting, caching + authenticating utilities and middleware.</li>
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