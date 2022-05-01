import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const About = () => {
    return html`
        <${Layout} navColor="blueviolet">
            <h1>About!</h1>
            <${App} />
            <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />
            <p>Need I say more?</p>
            <a href="https://github.com/sebringrose/peko">Github</a>
            <p>Credit for the bird: <a href="https://twemoji.twitter.com">https://twemoji.twitter.com</a></p>
        </${Layout}>
    `
}

export default About
