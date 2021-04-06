import { html } from  '/htm/preact'

const Layout = ({ navColour, children }) => {

    return html`<div>
        <nav style=${navStyle(navColour)}>
            <a style=${navLinkStyle} href="/">Home</a>
            <a style=${navLinkStyle} href="/about">About</a>
        </nav>
        <main style=${mainStyle}>
            ${children}
        </main>
    </div>`
        
}

const navStyle = (colour) => `
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    background-color: ${colour};
`

const navLinkStyle = `
    margin: 1rem;
`

const mainStyle = `
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
`
  
export default Layout
