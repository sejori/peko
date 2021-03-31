import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const Home = () => {
    return html`
        <${Layout} navColour="palegreen">
            <h1>The epic union of Deno 🦕 & Preact ⚛️</h1>
            <p>A deno http server renders the content of the page and serves it to the browser as html. The browser then fetches the page's Javascript via Skypack CDN (for external modules) and the Deno server (for internal modules) and hydrates the page.</p>
            <p>To see this in action refresh the page and watch the last render time below.</p> 
            <${App} />
            <p>Last render: ${new Date().toString()}</p>
            <h2>Why is this cool?</h2>
            <p>Because there is no transpilation of Javascript required. The deno server and the browser use the exact same code!</p>
            <p>No code bundling is required either and by using es modules we can leverage the browsers in-built caching systems to keep our sites as speedy as your favourite chicken-looking dinosaur or blue-coloured hedgehog.</p>
            <h2>Awesome features:</h2>
            <ul>
                <li><strong>Server-side rendering</strong> - boost SEO and UX with instant content.</li>
                <li><strong>Featherweight apps</strong> - only default external modules are preact and htm, totalling less than 5kb combined.</li>
                <li><strong>Hot-reloading</strong> - smooth DX with in-built devSocket, notifies browsers of src changes and triggers a reload (only used when ENVIRONMENT=development in .env).</li>
                <li><strong>CSS handling</strong> - css files present in src directory are bundled into html template (for non-global component styles use inline css in the component's js file).</li>
                <li><strong>useLocalState</strong> - hook for syncing state to localStorage, helpful for sharing state between components and preserving across user sessions and hot-reloads.</li>
            </ul>
        </${Layout}>
    `
}

export default Home