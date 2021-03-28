import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"

const About = () => {
    return html`
        <${Layout} navColour="lavender">
            <h1>About!</h1>
            <img style=${imgStyle} src="/assets/lighthouse-score.png" alt="lighthouse-score" />
            <p>Need I say more?</p>
            <a href="https://github.com/sebringrose/fastify-preact-ssr">Github</a>
        </${Layout}>
    `
}

const imgStyle = `
    max-width: 100%;
`

export default About
