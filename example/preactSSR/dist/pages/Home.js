// example/preactSSR/src/pages/Home.ts
import { html as html2 } from "htm/preact";

// example/preactSSR/src/components/Layout.ts
import { html } from "htm/preact";
var Layout = ({
  navColor,
  navLink,
  children
}) => {
  return html`
    <nav style=${navStyle(navColor)}>
      <div class="container align-center">
        <img
          height="200px"
          width="1000px"
          style="max-width:100%; margin: 1rem;"
          src="https://raw.githubusercontent.com/sejori/peko/main/example/preactSSR/assets/logo_dark_alpha.webp"
          alt="peko-logo"
        />
        <h1 style="text-align: center;">
          Featherweight <a href="/${navLink}" style=${navLinkStyle}>apps</a>
        </h1>
        <h2 style="text-align: center;">on the edge 🐣⚡</h2>
      </div>
    </nav>
    <main style="padding: 1rem;" class="container">${children}</main>
    <footer style=${footerStyle}>
      <div class="container row">
        <a style=${footerLinkStyle} href="https://github.com/sebringrose/peko">
          <img
            src="https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/github.svg"
            width="100"
            height="100"
            alt="GitHub"
          />
          Source repo
        </a>
        <a
          class="align-center"
          style=${footerLinkStyle}
          href="https://doc.deno.land/https://deno.land/x/peko/mod.ts"
        >
          <img
            src="https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg"
            width="100"
            height="100"
            alt="Deno"
          />
          API docs
        </a>
      </div>
      <div class="container row">
        <a style=${footerLinkStyle} href="/">Home</a>
        <a style=${footerLinkStyle} href="/about">About</a>
      </div>
      <p style="margin: 10px; text-align: center">
        Made by <a href="https://thesebsite.com">Sejori</a>
      </p>
    </footer>
  `;
};
var navStyle = (navColor) => `
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  background-color: ${navColor};
  padding-bottom: 20px;
`;
var navLinkStyle = `
  color: white;
`;
var footerStyle = `
  padding-top: 20px;
`;
var footerLinkStyle = `
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  padding: 0px 5px;
  margin-bottom: 1rem;
`;
var Layout_default = Layout;

// example/preactSSR/src/pages/Home.ts
var Home = () => {
  return html2`
    <${Layout_default} navLink="about" navColor="#101727">
      <h2>Features</h2>
      <ul>
        <li>Simple and familiar syntax, supports any modern JS/TS environment.</li>
        <li>Library of request <a href="#handlers">handlers</a>, <a href="#middleware">middleware</a> and <a href="#utils">utils</a>.</li>
        <li>Cascades <a target="_blank" href="https://github.com/sebringrose/peko/blob/main/server.ts">Request Context</a> through middleware stack for data flow and post-response operations.</li>
        <li>100% TypeScript complete with tests.</li>
      </ul>

      <h2>Guides</h2>
      <ol>
        <li><a href="https://github.com/sebringrose/peko/blob/main/react.md">How to build a full-stack React application with Peko and Deno</a></li>
        <li>Want to build a lightweight HTML or Preact app? Check out the <a href="https://github.com/sebringrose/peko/blob/main/examples">examples</a>!</li>
      </ol>

      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div>
          <h2 id="handlers">Handlers</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/ssr.ts">Server-side render</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/file.ts">Static files</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/handlers/sse.ts">Server-sent events</a></li>
          </ul>
        </div>

        <div>
          <h2 id="middleware">Middleware</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/authenticator.ts">JWT verifying</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/cacher.ts">Response caching</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/middleware/logger.ts">Request logging</a></li>
          </ul>
        </div>

        <div>
          <h2 id="utils">Utils</h2>
          <ul>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/utils/Crypto.ts">Crypto - JWT/hashing</a></li>
            <li><a target="_blank" href="https://github.com/sebringrose/peko/blob/main/utils/Profiler.ts">Profiler</a></li>
          </ul>
        </div>
      </div>
    </${Layout_default}>
  `;
};
var Home_default = Home;
export {
  Home_default as default
};
//# sourceMappingURL=Home.js.map
