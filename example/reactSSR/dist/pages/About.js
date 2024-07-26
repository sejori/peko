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

// example/reactSSR/src/components/App.tsx
import { useState as useState3, useEffect as useEffect2 } from "react";

// example/reactSSR/src/components/List.tsx
import { useState } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var List = ({ data }) => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
  return /* @__PURE__ */ jsxs2("div", { children: [
    /* @__PURE__ */ jsx2("ul", { children: data && data.map((i) => /* @__PURE__ */ jsxs2("li", { children: [
      i,
      " ",
      /* @__PURE__ */ jsx2("button", { onClick: handleClick, children: "Click me" })
    ] }, i)) }),
    /* @__PURE__ */ jsx2("p", { children: /* @__PURE__ */ jsxs2("strong", { children: [
      count,
      " ",
      count === 1 ? "click" : "clicks",
      " counted"
    ] }) })
  ] });
};
var List_default = List;

// example/reactSSR/src/hooks/useLocalState.ts
import { useState as useState2, useEffect } from "react";
var initialState = {
  dataArray: ["Item 0", "Item 1", "Item 2"]
};
var listeners = {};
Object.keys(initialState).forEach((key) => listeners[key] = []);
var useLocalState = (key) => {
  if (typeof localStorage === "undefined") return useState2(initialState[key]);
  const [state, setState] = useState2(getLocalStateValue(key));
  listeners[key].push(setState);
  useEffect(() => {
    try {
      setLocalStateValue(key, state);
    } catch (e) {
      console.log(e);
    }
    return () => {
      listeners[key].filter((listener) => listener !== setState);
    };
  }, [state]);
  return [state, setState];
};
var getLocalState = () => {
  const localState = localStorage.getItem("localState");
  return localState ? { ...initialState, ...JSON.parse(localState) } : initialState;
};
var getLocalStateValue = (key) => {
  const localState = getLocalState();
  if (localState[key]) return localState[key];
  throw new Error(
    `Key "${key}" does not exist in localState. Make sure it is added to initialState in /src/hooks/localstate.js.`
  );
};
var setLocalStateValue = (key, value) => {
  listeners[key].forEach((setState) => setState(value));
  return localStorage.setItem(
    "localState",
    JSON.stringify({ ...getLocalState(), [key]: value })
  );
};

// example/reactSSR/src/components/App.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var App = () => {
  const [dataArray, setDataArray] = useLocalState("dataArray");
  const [latestEvent, setLatestEvent] = useState3(0);
  useEffect2(() => {
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
  return /* @__PURE__ */ jsxs3("div", { style: { margin: "2rem 0" }, children: [
    /* @__PURE__ */ jsxs3("p", { children: [
      /* @__PURE__ */ jsx3("strong", { children: "Latest random number from server: " }),
      " ",
      latestEvent
    ] }),
    /* @__PURE__ */ jsx3(List_default, { data: dataArray }),
    /* @__PURE__ */ jsx3(
      "button",
      {
        style: btnLgStyle,
        onClick: () => setDataArray((dataArray2) => [
          ...dataArray2,
          `Item ${dataArray2.length}`
        ]),
        children: "add item"
      }
    ),
    /* @__PURE__ */ jsx3(
      "button",
      {
        style: btnLgStyle,
        onClick: () => setDataArray(
          (dataArray2) => dataArray2.slice(0, dataArray2.length - 1)
        ),
        children: "remove item"
      }
    )
  ] });
};
var btnLgStyle = {
  margin: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem"
};
var App_default = App;

// example/reactSSR/src/pages/About.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var About = (props) => {
  return /* @__PURE__ */ jsxs4(Layout_default, { navLink: "/", navColor: "blueviolet", children: [
    /* @__PURE__ */ jsxs4(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap"
        },
        children: [
          /* @__PURE__ */ jsxs4("p", { style: { margin: "5px" }, children: [
            /* @__PURE__ */ jsx4("strong", { children: "Request time: " }),
            props.request_time
          ] }),
          /* @__PURE__ */ jsxs4("p", { style: { margin: "5px" }, children: [
            /* @__PURE__ */ jsx4("strong", { children: "Hydration time: " }),
            Date.now()
          ] }),
          /* @__PURE__ */ jsxs4("p", { style: { margin: "5px" }, children: [
            /* @__PURE__ */ jsx4("strong", { children: "Served from: " }),
            props.DENO_REGION ? props.DENO_REGION : "localhost"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx4("img", { src: "/assets/lighthouse-score.png", alt: "lighthouse-score" }),
    /* @__PURE__ */ jsxs4("p", { children: [
      "This website is appified with the Preact JavaScript library. It even uses localStorage to store state locally between page loads \u{1F92F}. Check out the \u{1F449}",
      " ",
      /* @__PURE__ */ jsx4("a", { href: "https://github.com/sejori/peko/tree/main/example/preactSSR", children: "source code here" }),
      " ",
      "\u{1F448}."
    ] }),
    /* @__PURE__ */ jsx4(App_default, {})
  ] });
};
var About_default = About;
export {
  About_default as default
};
//# sourceMappingURL=About.js.map
