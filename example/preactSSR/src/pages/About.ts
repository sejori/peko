import { html } from "htm/preact";

import Layout from "../components/Layout.ts";
import App from "../components/App.ts";

const About = (props: Record<string, unknown>) => {
  return html`
    <${Layout} navLink="" navColor="blueviolet">
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <p style="margin:5px"><strong>Request time:</strong> ${
          props.request_time
        }</p>
        <p style="margin:5px"><strong>Hydration time:</strong> ${Date.now()}</p>
        <p style="margin:5px"><strong>Served from:</strong> ${
          props.DENO_REGION ? props.DENO_REGION : "localhost"
        }</p>
      </div>

      <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />

      <p>
        This website is appified with the Preact JavaScript library.
        It even uses localStorage to store state locally between page loads 🤯.
        Check out the 👉 <a href="https://github.com/sejori/peko/tree/main/example/preactSSR">source code here</a> 👈.
      </p>

      <${App} />
    </${Layout}>
  `;
};

export default About;
