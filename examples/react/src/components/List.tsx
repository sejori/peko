import React, { useState } from "https://esm.sh/react@18.2.0"

const List = ({ data }: { data: string[] }) => {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  return <div>
    <ul>
      {data && data.map(i => <li key={i}>
        <button onClick={handleClick}>Click me</button>
      </li>)}
    </ul>
    <p><strong>{count} {count === 1 ? 'click' : 'clicks'} counted</strong></p>
  </div>
}

export default List
