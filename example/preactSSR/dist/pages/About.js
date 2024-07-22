// example/preactSSR/src/pages/About.ts
import { html as html4 } from "htm/preact";

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

// example/preactSSR/src/components/App.ts
import { useState as useState3, useEffect as useEffect2 } from "preact/hooks";
import { html as html3 } from "htm/preact";

// example/preactSSR/src/components/List.ts
import { useState } from "preact/hooks";
import { html as html2 } from "htm/preact";
var List = ({ data }) => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
  return html2`
    <div>
      <ul>
        ${data && data.map(
    (i) => html2`
            <li>${i}: <button onClick=${handleClick}>Click me</button></li>
          `
  )}
      </ul>
      <p>
        <strong>${count} ${count === 1 ? "click" : "clicks"} counted</strong>
      </p>
    </div>
  `;
};
var List_default = List;

// example/preactSSR/src/hooks/useLocalState.ts
import { useState as useState2, useEffect } from "preact/hooks";
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
    return () => listeners[key].filter((listener) => listener !== setState);
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

// example/preactSSR/src/components/App.ts
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
  return html3`
    <div style="margin: 2rem 0;">
      <p><strong>Latest random number from server: </strong> ${latestEvent}</p>

      <${List_default} data=${dataArray} />

      <button
        style=${btnLgStyle}
        onClick=${() => setDataArray((dataArray2) => [
    ...dataArray2,
    `Item ${dataArray2.length}`
  ])}
      >
        add item
      </button>
      <button
        style=${btnLgStyle}
        onClick=${() => setDataArray(
    (dataArray2) => dataArray2.slice(0, dataArray2.length - 1)
  )}
      >
        remove item
      </button>
    </div>
  `;
};
var btnLgStyle = `
    margin: 0.5rem;  
    padding: 0.5rem;
    font-size: 1rem;
`;
var App_default = App;

// example/preactSSR/src/pages/About.ts
var About = (props) => {
  return html4`
    <${Layout_default} navLink="" navColor="blueviolet">
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <p style="margin:5px"><strong>Request time:</strong> ${props.request_time}</p>
        <p style="margin:5px"><strong>Hydration time:</strong> ${Date.now()}</p>
        <p style="margin:5px"><strong>Served from:</strong> ${props.DENO_REGION ? props.DENO_REGION : "localhost"}</p>
      </div>

      <img src="/assets/lighthouse-score.png" alt="lighthouse-score" />

      <p>
        This website is appified with the Preact JavaScript library.
        It even uses localStorage to store state locally between page loads 🤯.
        Check out the 👉 <a href="https://github.com/sejori/peko/tree/main/example/preactSSR">source code here</a> 👈.
      </p>

      <${App_default} />
    </${Layout_default}>
  `;
};
var About_default = About;
export {
  About_default as default
};
//# sourceMappingURL=About.js.map
