// example/reactSSR/src/components/Layout.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Layout = ({
  navColor,
  navLink,
  children
}) => {
  return /* @__PURE__ */ jsxs("main", { children: [
    /* @__PURE__ */ jsx("nav", { style: navStyle(navColor), children: /* @__PURE__ */ jsxs("div", { className: "container align-center", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          height: "200px",
          width: "1000px",
          style: { maxWidth: "100%", margin: "1rem" },
          src: "/assets/logo_dark_alpha.webp",
          alt: "peko-logo"
        }
      ),
      /* @__PURE__ */ jsxs("h1", { style: { textAlign: "center" }, children: [
        "Featherweight",
        " ",
        /* @__PURE__ */ jsx("a", { href: navLink, style: navLinkStyle, children: "apps" })
      ] }),
      /* @__PURE__ */ jsx("h2", { style: { textAlign: "center" }, children: "on the edge \u{1F423}\u26A1" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { padding: "1rem" }, className: "container", children }),
    /* @__PURE__ */ jsxs("footer", { style: footerStyle, children: [
      /* @__PURE__ */ jsxs("div", { className: "container row", children: [
        /* @__PURE__ */ jsxs("a", { style: footerLinkStyle, href: "https://github.com/sejori/peko", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/github.svg",
              width: "100",
              height: "100",
              alt: "GitHub"
            }
          ),
          "Source repo"
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            className: "align-center",
            style: footerLinkStyle,
            href: "https://doc.deno.land/https://deno.land/x/peko/mod.ts",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg",
                  width: "100",
                  height: "100",
                  alt: "Deno"
                }
              ),
              "API docs"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "container row", children: [
        /* @__PURE__ */ jsx("a", { style: footerLinkStyle, href: "/", children: "Home" }),
        /* @__PURE__ */ jsx("a", { style: footerLinkStyle, href: "/about", children: "About" })
      ] }),
      /* @__PURE__ */ jsxs("p", { style: { margin: "10px", textAlign: "center" }, children: [
        "Made by ",
        /* @__PURE__ */ jsx("a", { href: "https://thesebsite.deno.dev", children: "Sejori" })
      ] })
    ] })
  ] });
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
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Home = () => {
  return /* @__PURE__ */ jsxs2(Layout_default, { navLink: "/about", navColor: "#101727", children: [
    /* @__PURE__ */ jsx2("h2", { children: "Features" }),
    /* @__PURE__ */ jsxs2("ul", { children: [
      /* @__PURE__ */ jsx2("li", { children: "Simple and familiar syntax, supports any modern JS/TS environment." }),
      /* @__PURE__ */ jsxs2("li", { children: [
        "Library of request ",
        /* @__PURE__ */ jsx2("a", { href: "#handlers", children: "handlers" }),
        ",",
        " ",
        /* @__PURE__ */ jsx2("a", { href: "#middleware", children: "middleware" }),
        " and ",
        /* @__PURE__ */ jsx2("a", { href: "#utils", children: "utils" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs2("li", { children: [
        "Cascades",
        " ",
        /* @__PURE__ */ jsx2(
          "a",
          {
            target: "_blank",
            href: "https://github.com/sebringrose/peko/blob/main/server.ts",
            children: "Request Context"
          }
        ),
        " ",
        "through middleware stack for data flow and post-response operations."
      ] }),
      /* @__PURE__ */ jsx2("li", { children: "100% TypeScript complete with tests." })
    ] }),
    /* @__PURE__ */ jsx2("h2", { children: "Guides" }),
    /* @__PURE__ */ jsxs2("ol", { children: [
      /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2("a", { href: "https://github.com/sebringrose/peko/blob/main/react.md", children: "How to build a full-stack React application with Peko and Deno" }) }),
      /* @__PURE__ */ jsxs2("li", { children: [
        "Want to build a lightweight HTML or Preact app? Check out the",
        " ",
        /* @__PURE__ */ jsx2("a", { href: "https://github.com/sebringrose/peko/blob/main/examples", children: "examples" }),
        "!"
      ] })
    ] }),
    /* @__PURE__ */ jsxs2(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap"
        },
        children: [
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsx2("h2", { id: "handlers", children: "Handlers" }),
            /* @__PURE__ */ jsxs2("ul", { children: [
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/handlers/ssr.ts",
                  children: "Server-side render"
                }
              ) }),
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/handlers/file.ts",
                  children: "Static files"
                }
              ) }),
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/handlers/sse.ts",
                  children: "Server-sent events"
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsx2("h2", { id: "middleware", children: "Middleware" }),
            /* @__PURE__ */ jsxs2("ul", { children: [
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/middleware/authenticator.ts",
                  children: "JWT verifying"
                }
              ) }),
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/middleware/cacher.ts",
                  children: "Response caching"
                }
              ) }),
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/middleware/logger.ts",
                  children: "Request logging"
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsx2("h2", { id: "utils", children: "Utils" }),
            /* @__PURE__ */ jsxs2("ul", { children: [
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/utils/Crypto.ts",
                  children: "Crypto - JWT/hashing"
                }
              ) }),
              /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
                "a",
                {
                  target: "_blank",
                  href: "https://github.com/sebringrose/peko/blob/main/utils/Profiler.ts",
                  children: "Profiler"
                }
              ) })
            ] })
          ] })
        ]
      }
    )
  ] });
};
var Home_default = Home;
export {
  Home_default as default
};
//# sourceMappingURL=Home.js.map
