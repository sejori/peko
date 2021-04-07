import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const About = () => {
    return html`
        <${Layout} navColor="lavender">
            <h1>About!</h1>
            <${App} />
            <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />
            <p>Need I say more?</p>
            <a href="https://github.com/sebringrose/velocireno">Github</a>
        </${Layout}>
    `
}

export default About
