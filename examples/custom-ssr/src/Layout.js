import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

const Layout = ({ navColor, children }) => {
    return html`<div>
        <nav style=${navStyle(navColor)}>
            <img height="100px" width="100px" style="margin: 1rem;" src="/assets/twemoji_chicken.svg" alt="chicken" />
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

const mainStyle = `
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
`
  
export default Layout
