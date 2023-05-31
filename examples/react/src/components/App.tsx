import React, { useState, useEffect } from "https://esm.sh/react@18.2.0"
import { useLocalState } from "../hooks/localstate.ts"
import { css } from "../template.ts"
import List from "./List.tsx"

const App = () => {
  const [dataArray, setDataArray] = useLocalState('dataArray', ['Item 0', 'Item 1', 'Item 2'])
  const [latestEvent, setLatestEvent] = useState(0)
  
  useEffect(() => {
    // @ts-ignore: EventSource browser API
    const sse = new EventSource("/api/sse")
    sse.onmessage = (e: MessageEvent) => {
      const eventData = JSON.parse(e.data)
      setLatestEvent(eventData.detail)
      console.log(e)
    }
    sse.onerror = (e: Event) => {
      sse.close()
      console.log(e)
    }
    // @ts-ignore: document browser API
    document.body.addEventListener("unload", () => sse.close())
    return () => sse.close()
  }, [])

  return <div style={{ margin: "2rem 0" }}>
      <p><strong>Latest random number from server: </strong>{latestEvent}</p>

      <List data={dataArray} />

      <button 
        onClick={() => setDataArray(dataArray => [...dataArray, `Item ${dataArray.length}`])}
      >
        add item
      </button>
      <button 
        onClick={() => setDataArray(dataArray => dataArray.slice(0, dataArray.length-1))}
      >
        remove item
      </button>
    </div>
}

css`
  button {
    margin: 0.5rem;  
    padding: 0.5rem;
    font-size: 1rem;
  }
`

export default App
