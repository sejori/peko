import { useState } from "preact/hooks";
import { html } from "htm/preact";

const List = ({ data }) => {
  // takes a data prop
  // how many clicks have we counted? Default to 0
  const [count, setCount] = useState(0);

  // shared event handler
  const handleClick = () => {
    setCount(count + 1);
  };

  return html`
    <div>
      <ul>
        ${data &&
        data.map(
          (i) => html`
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

export default List;
