import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

const Layout = ({ navColor, children }) => {
  return html`
    <nav style=${navStyle(navColor)}>
      <div class="container row">
        <a style=${navLinkStyle} href="/">Home</a>
        <img height="100px" width="100px" style="margin: 1rem;" src="/assets/twemoji_chick.svg" alt="peko-chick" />
        <a style=${navLinkStyle} href="/about">About</a>
      </div>
    </nav>
    <main style="padding: 1rem;" class="container">
      ${children}
    </main>
    <footer>
      <p style="margin: 5px; text-align: center">Build for the open source community by <a style="color: white;" href="https://github.com/sebringrose">Seb Ringrose</a></p>
    </footer>
  `   
}

const navStyle = (navColor) => `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: firebrick;
  background-color: ${navColor};
`

const navLinkStyle = `
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 1rem 1rem;
  color: white;
  padding: 0px 5px;
`
  
export default Layout
