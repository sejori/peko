import React from "https://esm.sh/react@18.2.0"
import Layout from "../components/Layout.tsx"
import App from "../components/App.tsx"

const About = (props: Record<string, string>) => {
  return <Layout navLink="" navColor="blueviolet">
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
      <p style={{ margin: "5px" }}><strong>Request time:</strong>{props.request_time}</p>
      <p style={{ margin: "5px" }}><strong>Hydration time:</strong>{Date.now()}</p>
      <p style={{ margin: "5px" }}><strong>Served from:</strong>{props.DENO_REGION ? props.DENO_REGION : "localhost"}</p>
    </div>

    <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />

    <p>
      This website is appified with the Preact JavaScript library.
      It even uses localStorage to store state locally between page loads 🤯.
      Check out the 👉 <a href="https://github.com/sebringrose/peko/tree/main/examples/preact">source code here</a> 👈.
    </p>

    <App />

    <p>Psst... Hey devs, the edge can do a lot more than just serve static files. Try POSTing some text to <code>/api/parrot</code>.</p>
  </Layout>
}

export default About
