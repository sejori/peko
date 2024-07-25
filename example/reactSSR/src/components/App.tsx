import React, { useState, useEffect } from "react";
import List from "./List.tsx";
// import { useLocalState } from "../hooks/useLocalState.ts";

const App = () => {
  // const [dataArray, setDataArray] = useLocalState("dataArray");
  const [dataArray, setDataArray] = useState(["Item 0", "Item 1", "Item 2"]);
  const [latestEvent, setLatestEvent] = useState(0);

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

  return (
    <div style={{ margin: "2rem 0" }}>
      <p>
        <strong>Latest random number from server: </strong> {latestEvent}
      </p>

      <List data={dataArray} />

      <button
        style={btnLgStyle}
        onClick={() =>
          setDataArray((dataArray: string[]) => [
            ...dataArray,
            `Item ${dataArray.length}`,
          ])
        }
      >
        add item
      </button>
      <button
        style={btnLgStyle}
        onClick={() =>
          setDataArray((dataArray: string[]) =>
            dataArray.slice(0, dataArray.length - 1)
          )
        }
      >
        remove item
      </button>
    </div>
  );
};

const btnLgStyle = {
  margin: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem",
};

export default App;
