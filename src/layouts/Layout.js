import { html } from  'https://cdn.skypack.dev/htm/preact'

const Layout = ({ navColor, children }) => {

    return html`<div>
        <nav style=${navStyle(navColor)}>
            <a style=${navLinkStyle} href="/">Home</a>
            <img style="height: 100px; margin: 1rem;" src="/assets/twemoji_chicken.svg" alt="chicken" />
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
`

const mainStyle = `
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
`
  
export default Layout
