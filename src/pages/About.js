import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"

const About = () => {
    return html`
        <${Layout} navColour="lavender">
            <h1>About!</h1>
            <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />
            <p>Need I say more?</p>
            <a href="https://github.com/sebringrose/velocireno">Github</a>
        </${Layout}>
    `
}

export default About
