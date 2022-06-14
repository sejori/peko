import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"
import List from "./List.js"
import { useLocalState } from "../hooks/localstate.js"

const App = () => {
  const [dataArray, setDataArray] = useLocalState('dataArray')

  return html`
    <div style="margin: 2rem 0;">
      <p>This website is appified with the Preact JavaScript library!</p>
      <p>It even uses localStorage to store state locally between page loads 🤯</p>
      <${List} data=${dataArray} />
      <button 
        class="btn-lg-primary" 
        onClick=${() => setDataArray(dataArray => [...dataArray, `Item ${dataArray.length}`])}
      >
        add item
      </button>
      <button 
        class="btn-lg-secondary" 
        onClick=${() => setDataArray(dataArray => dataArray.slice(0, dataArray.length-1))}
      >
        remove item
      </button>
    </div>
  `
}

export default App
