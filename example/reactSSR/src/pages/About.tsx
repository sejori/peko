import React, { ReactNode } from "react";
import Layout from "../components/Layout.tsx";
import App from "../components/App.tsx";

const About = (props: Record<string, ReactNode>) => {
  return (
    <Layout navLink="/" navColor="blueviolet">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <p style={{ margin: "5px" }}>
          <strong>Request time: </strong>
          {props.request_time}
        </p>
        <p style={{ margin: "5px" }}>
          <strong>Hydration time: </strong>
          {Date.now()}
        </p>
        <p style={{ margin: "5px" }}>
          <strong>Served from: </strong>
          {props.DENO_REGION ? props.DENO_REGION : "localhost"}
        </p>
      </div>

      <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />

      <p>
        This website is appified with the Preact JavaScript library. It even
        uses localStorage to store state locally between page loads 🤯. Check
        out the 👉{" "}
        <a href="https://github.com/sejori/peko/tree/main/example/preactSSR">
          source code here
        </a>{" "}
        👈.
      </p>

      <App />
    </Layout>
  );
};

export default About;
