// example/reactSSR/src/pages/About.tsx
import React4 from "react";

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

// example/reactSSR/src/components/App.tsx
import React3, { useState as useState2, useEffect } from "react";

// example/reactSSR/src/components/List.tsx
import React2, { useState } from "react";
var List = ({ data }) => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
  return /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("ul", null, data && data.map((i) => /* @__PURE__ */ React2.createElement("li", { key: i }, i, " ", /* @__PURE__ */ React2.createElement("button", { onClick: handleClick }, "Click me")))), /* @__PURE__ */ React2.createElement("p", null, /* @__PURE__ */ React2.createElement("strong", null, count, " ", count === 1 ? "click" : "clicks", " counted")));
};
var List_default = List;

// example/reactSSR/src/components/App.tsx
var App = () => {
  const [dataArray, setDataArray] = useState2(["Item 0", "Item 1", "Item 2"]);
  const [latestEvent, setLatestEvent] = useState2(0);
  useEffect(() => {
    const sse = new EventSource("/sse");
    sse.onmessage = (e) => {
      const eventData = JSON.parse(e.data);
      setLatestEvent(eventData.detail);
      console.log(e);
    };
    sse.onerror = (e) => {
      sse.close();
      console.log(e);
    };
    document.body.addEventListener("unload", () => sse.close());
    return () => sse.close();
  }, []);
  return /* @__PURE__ */ React3.createElement("div", { style: { margin: "2rem 0" } }, /* @__PURE__ */ React3.createElement("p", null, /* @__PURE__ */ React3.createElement("strong", null, "Latest random number from server: "), " ", latestEvent), /* @__PURE__ */ React3.createElement(List_default, { data: dataArray }), /* @__PURE__ */ React3.createElement(
    "button",
    {
      style: btnLgStyle,
      onClick: () => setDataArray((dataArray2) => [
        ...dataArray2,
        `Item ${dataArray2.length}`
      ])
    },
    "add item"
  ), /* @__PURE__ */ React3.createElement(
    "button",
    {
      style: btnLgStyle,
      onClick: () => setDataArray(
        (dataArray2) => dataArray2.slice(0, dataArray2.length - 1)
      )
    },
    "remove item"
  ));
};
var btnLgStyle = {
  margin: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem"
};
var App_default = App;

// example/reactSSR/src/pages/About.tsx
var About = (props) => {
  return /* @__PURE__ */ React4.createElement(Layout_default, { navLink: "/", navColor: "blueviolet" }, /* @__PURE__ */ React4.createElement(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      }
    },
    /* @__PURE__ */ React4.createElement("p", { style: { margin: "5px" } }, /* @__PURE__ */ React4.createElement("strong", null, "Request time: "), props.request_time),
    /* @__PURE__ */ React4.createElement("p", { style: { margin: "5px" } }, /* @__PURE__ */ React4.createElement("strong", null, "Hydration time: "), Date.now()),
    /* @__PURE__ */ React4.createElement("p", { style: { margin: "5px" } }, /* @__PURE__ */ React4.createElement("strong", null, "Served from: "), props.DENO_REGION ? props.DENO_REGION : "localhost")
  ), /* @__PURE__ */ React4.createElement("img", { src: "/assets/lighthouse-score.png", alt: "lighthouse-score" }), /* @__PURE__ */ React4.createElement("p", null, "This website is appified with the Preact JavaScript library. It even uses localStorage to store state locally between page loads \u{1F92F}. Check out the \u{1F449}", " ", /* @__PURE__ */ React4.createElement("a", { href: "https://github.com/sejori/peko/tree/main/example/preactSSR" }, "source code here"), " ", "\u{1F448}."), /* @__PURE__ */ React4.createElement(App_default, null));
};
var About_default = About;
export {
  About_default as default
};
//# sourceMappingURL=About.js.map
