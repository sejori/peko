import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../components/Layout.js"
import App from "../components/App.js"

const About = (props) => {
  return html`
    <${Layout} navLink="" navColor="blueviolet">
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <p style="margin:5px"><strong>Request time:</strong> ${props.request_time}</p>
        <p style="margin:5px"><strong>Hydration time:</strong> ${Date.now()}</p>
        <p style="margin:5px"><strong>Served from:</strong> ${props.DENO_REGION ? props.DENO_REGION : "localhost"}</p>
      </div>

      <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />

      <p>
        This website is appified with the Preact JavaScript library.
        It even uses localStorage to store state locally between page loads 🤯.
        Check out the 👉 <a href="https://github.com/sebringrose/peko/tree/main/examples/preact">source code here</a> 👈.
      </p>

      <${App} />

      <p>Psst... Hey devs, the edge can do a lot more than just serve static files. Try POSTing some text to <code>/api/parrot</code>.</p>
    </${Layout}>
  `
}

export default About
