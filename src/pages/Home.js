import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const Home = () => {
    return html`
        <${Layout} navColour="palegreen">
            <h1>The epic union of Deno 🦕, Skypack 🛰️ & Preact ⚛️</h1>
            <p>A deno http server renders the content of this page and serves it to the browser as html. The browser then fetches the page's Javascript via Skypack CDN (for external modules) and the Deno server (for custom modules) and hydrates the page.</p>
            <p>To see this in action refresh the page and watch the last render time below.</p> 
            <${App} />
            <p>Last render: ${new Date().toString()}</p>
            <h2>Why is this cool?</h2>
            <p>Because there is no transpilation of Javascript required. The deno server and the browser use the exact same code!</p>
            <p>No code bundling is required either and by using es modules we can leverage the browsers in-built caching systems to keep our sites as speedy as your favourite chicken-looking dinosaur or blue-coloured hedgehog.</p>
        </${Layout}>
    `
}
  
export default Home