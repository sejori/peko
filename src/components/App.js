import { html } from  "https://cdn.skypack.dev/htm/preact"
import { useLocalState } from "../hooks/localstate.js"

import List from "./List.js"

const App = () => {
    const [dataArray, setDataArray] = useLocalState("dataArray", ['Item 0', 'Item 1', 'Item 2'])

    return html`
        <div>
            <${List} data=${dataArray} />
            <button style=${buttonStyle} onClick=${() => setDataArray(dataArray => [...dataArray, `Item ${dataArray.length}`])}>add item</button>
        </div>
    `
}

const buttonStyle = `
    border: solid 1px red;
    background-color: orange;
    padding: 0.5rem;
    font-size: 1rem;
`

export default App
