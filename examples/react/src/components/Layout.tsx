import React from "https://esm.sh/react@18.2.0"
import { css } from "../template.ts"

const Layout = (
    { navColor, navLink, children }:
    { navColor: string, navLink: string, children: React.ReactNode }
) => <>
  <nav style={{ backgroundColor: navColor }}>
    <div className="container align-center">
      <img height="200px" style={{ maxWidth: "100%", margin: "1rem" }} src="/assets/logo_dark_alpha.webp" alt="peko-chick" />  
      <h1 style={{ textAlign: "center" }}>Featherweight <a href={navLink}>apps</a> on the stateless edge</h1>
    </div>
  </nav>
  <main style={{ padding: "1rem" }} className="container">
    {children}
  </main>
  <footer>
    <div className="container row">
      <a href="https://github.com/sebringrose/peko">
        <img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" width="100" height="100" alt="GitHub" />
        Source repo
      </a>
      <a className="align-center" href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">
        <img src="https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg" width="100" height="100" alt="Deno" />
        API docs
      </a>
    </div>
    <div className="container row">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </div>
    <p style={{ margin: "10px", textAlign: "center" }}>Created by <a href="https://thesebsite.com">Seb Ringrose</a></p>
    <p style={{ margin: "10px", textAlign: "center" }}>Logo by <a href="https://iiisun.art">Third Sun</a></p>
  </footer>
</>

css`
  nav {
    width: 100%;
    display: flex;
    flexDirection: column;
    justifyContent: center;
    color: white;
    paddingBottom: 20px;
  }

  nav a {
    color: white;
  }

  footer {
    padding-top: 20px;
  }

  footer a {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    padding: 0px 5px;
    margin-bottom: 1rem;
  }
`
  
export default Layout
