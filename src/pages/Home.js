import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const Home = () => {
    return html`
        <${Layout} navColour="palegreen">
            <h1>The epic union of Deno & Preact 💖</h1>
            <p>A deno http server has rendered the content of this page and served it to your browser as html.</p>
            <p>Your browser then fetchs the Preact Javascript module for the page (along with all of it's imports) and hydrated the page.</p>
            <p>To see this in action refresh the page and watch the last render time below...</p> 
            <${App} />
            <p>Last render: ${new Date().toString()}</p>
        </${Layout}>
    `
}
  
export default Home