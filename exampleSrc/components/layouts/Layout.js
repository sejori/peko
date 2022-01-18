import { html } from "https://raw.githubusercontent.com/sebringrose/peko/main/lib/react.js"

const Layout = ({ navColor, children }) => {
    return html`<div>
        <nav style=${navStyle(navColor)}>
            <a style=${navLinkStyle} href="/">Home</a>
            <img height="100px" width="100px" style="margin: 1rem;" src="/assets/twemoji_chicken.svg" alt="chicken" />
            <a style=${navLinkStyle} href="/about">About</a>
        </nav>
        <main style=${mainStyle}>
            ${children}
        </main>
    </div>`
        
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
    margin: 1rem 3rem;
    color: white;
    text-decoration-color: red;
`

const mainStyle = `
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
`
  
export default Layout
