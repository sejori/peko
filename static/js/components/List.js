import { html } from  "https://cdn.skypack.dev/htm/preact"
import { useState } from "https://cdn.skypack.dev/preact/hooks"

const List = ({ data }) => { // takes a data prop
    // how many clicks have we counted? Default to 0
    const [count, setCount] = useState(0)

    // shared event handler
    const handleClick = () => {
        setCount(count + 1)
    }

    return html`
        <ul>
            ${data && data.map(i => html`
                <li>
                    <!-- listen for button clicks --> 
                    ${i}: <button onClick=${handleClick}>Click me</button>
                </li>
            `)}
            <li>
                <!-- list how many clicks we've seen, with the right plural -->
                ${count} ${count === 1 ? 'click' : 'clicks'} counted
            </li>
        </ul>
    `
}

export default List
