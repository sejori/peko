import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../components/Layout.js"
import App from "../components/App.js"

const About = () => {
  return html`
    <${Layout} navColor="blueviolet">
      <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />
      <p>Need I say more?</p>
      <${App} />
      <p>Credit for the bird: <a href="https://twemoji.twitter.com">https://twemoji.twitter.com</a></p>
    </${Layout}>
  `
}

export default About
