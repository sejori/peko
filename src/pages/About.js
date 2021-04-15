import { html } from "https://cdn.skypack.dev/htm/preact"

import { hydrate } from "../hooks/hydrate.js"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const About = () => {
    return html`
        <${Layout} navColor="violet">
            <h1>About!</h1>
            <${App} />
            <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />
            <p>Need I say more?</p>
            <a href="https://github.com/sebringrose/velocireno">Github</a>
            <p>Credit for the birds: <a href="https://twemoji.twitter.com">https://twemoji.twitter.com</a></p>
        </${Layout}>
    `
}

export default hydrate(About)
