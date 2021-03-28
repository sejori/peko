import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"
import App from "../components/App.js"

const Home = () => {
    return html`
        <${Layout} navColour="palegreen">
            <h1>Home!</h1>
            <${App} />
            <p>Time: ${new Date().toString()}</p>
        </${Layout}>
    `
}
  
export default Home