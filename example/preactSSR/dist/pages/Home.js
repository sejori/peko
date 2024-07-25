// example/reactSSR/src/pages/Home.tsx
import React2 from "react";

// example/reactSSR/src/components/Layout.tsx
import React from "react";
var Layout = ({
  navColor,
  navLink,
  children
}) => {
  return /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement("nav", { style: navStyle(navColor) }, /* @__PURE__ */ React.createElement("div", { className: "container align-center" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      height: "200px",
      width: "1000px",
      style: { maxWidth: "100%", margin: "1rem" },
      src: "/assets/logo_dark_alpha.webp",
      alt: "peko-logo"
    }
  ), /* @__PURE__ */ React.createElement("h1", { style: { textAlign: "center" } }, "Featherweight", " ", /* @__PURE__ */ React.createElement("a", { href: navLink, style: navLinkStyle }, "apps")), /* @__PURE__ */ React.createElement("h2", { style: { textAlign: "center" } }, "on the edge \u{1F423}\u26A1"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "1rem" }, className: "container" }, children), /* @__PURE__ */ React.createElement("footer", { style: footerStyle }, /* @__PURE__ */ React.createElement("div", { className: "container row" }, /* @__PURE__ */ React.createElement("a", { style: footerLinkStyle, href: "https://github.com/sebringrose/peko" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/github.svg",
      width: "100",
      height: "100",
      alt: "GitHub"
    }
  ), "Source repo"), /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "align-center",
      style: footerLinkStyle,
      href: "https://doc.deno.land/https://deno.land/x/peko/mod.ts"
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg",
        width: "100",
        height: "100",
        alt: "Deno"
      }
    ),
    "API docs"
  )), /* @__PURE__ */ React.createElement("div", { className: "container row" }, /* @__PURE__ */ React.createElement("a", { style: footerLinkStyle, href: "/" }, "Home"), /* @__PURE__ */ React.createElement("a", { style: footerLinkStyle, href: "/about" }, "About")), /* @__PURE__ */ React.createElement("p", { style: { margin: "10px", textAlign: "center" } }, "Made by ", /* @__PURE__ */ React.createElement("a", { href: "https://thesebsite.com" }, "Sejori"))));
};
var navStyle = (navColor) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  color: "white",
  backgroundColor: navColor,
  paddingBottom: "20px"
});
var navLinkStyle = {
  color: "white"
};
var footerStyle = {
  paddingTop: "20px"
};
var footerLinkStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontSize: "1rem",
  padding: "0px 5px",
  marginBottom: "1rem"
};
var Layout_default = Layout;

// example/reactSSR/src/pages/Home.tsx
var Home = () => {
  return /* @__PURE__ */ React2.createElement(Layout_default, { navLink: "/about", navColor: "#101727" }, /* @__PURE__ */ React2.createElement("h2", null, "Features"), /* @__PURE__ */ React2.createElement("ul", null, /* @__PURE__ */ React2.createElement("li", null, "Simple and familiar syntax, supports any modern JS/TS environment."), /* @__PURE__ */ React2.createElement("li", null, "Library of request ", /* @__PURE__ */ React2.createElement("a", { href: "#handlers" }, "handlers"), ",", " ", /* @__PURE__ */ React2.createElement("a", { href: "#middleware" }, "middleware"), " and ", /* @__PURE__ */ React2.createElement("a", { href: "#utils" }, "utils"), "."), /* @__PURE__ */ React2.createElement("li", null, "Cascades", " ", /* @__PURE__ */ React2.createElement(
    "a",
    {
      target: "_blank",
      href: "https://github.com/sebringrose/peko/blob/main/server.ts"
    },
    "Request Context"
  ), " ", "through middleware stack for data flow and post-response operations."), /* @__PURE__ */ React2.createElement("li", null, "100% TypeScript complete with tests.")), /* @__PURE__ */ React2.createElement("h2", null, "Guides"), /* @__PURE__ */ React2.createElement("ol", null, /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement("a", { href: "https://github.com/sebringrose/peko/blob/main/react.md" }, "How to build a full-stack React application with Peko and Deno")), /* @__PURE__ */ React2.createElement("li", null, "Want to build a lightweight HTML or Preact app? Check out the", " ", /* @__PURE__ */ React2.createElement("a", { href: "https://github.com/sebringrose/peko/blob/main/examples" }, "examples"), "!")), /* @__PURE__ */ React2.createElement(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap"
      }
    },
    /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("h2", { id: "handlers" }, "Handlers"), /* @__PURE__ */ React2.createElement("ul", null, /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/handlers/ssr.ts"
      },
      "Server-side render"
    )), /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/handlers/file.ts"
      },
      "Static files"
    )), /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/handlers/sse.ts"
      },
      "Server-sent events"
    )))),
    /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("h2", { id: "middleware" }, "Middleware"), /* @__PURE__ */ React2.createElement("ul", null, /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/middleware/authenticator.ts"
      },
      "JWT verifying"
    )), /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/middleware/cacher.ts"
      },
      "Response caching"
    )), /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/middleware/logger.ts"
      },
      "Request logging"
    )))),
    /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("h2", { id: "utils" }, "Utils"), /* @__PURE__ */ React2.createElement("ul", null, /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/utils/Crypto.ts"
      },
      "Crypto - JWT/hashing"
    )), /* @__PURE__ */ React2.createElement("li", null, /* @__PURE__ */ React2.createElement(
      "a",
      {
        target: "_blank",
        href: "https://github.com/sebringrose/peko/blob/main/utils/Profiler.ts"
      },
      "Profiler"
    ))))
  ));
};
var Home_default = Home;
export {
  Home_default as default
};
//# sourceMappingURL=Home.js.map
