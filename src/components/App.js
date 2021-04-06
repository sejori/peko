import { html } from  "/htm/preact"
import { useLocalState } from "../hooks/localstate.js"

import List from "./List.js"

const App = () => {
    const [dataArray, setDataArray] = useLocalState("dataArray", ['Item 0', 'Item 1', 'Item 2'])

    return html`
        <div>
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
