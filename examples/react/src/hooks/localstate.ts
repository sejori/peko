import { useState, useEffect } from "https://esm.sh/react@18.2.0"

// listeners object stores arrays of all state variable setters for each key
const listeners: Record<string, unknown[]> = {}

function useLocalState<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialState)
  listeners[key] = listeners[key] || []
  listeners[key].push(setState)

  useEffect(() => {
    try {
      setLocalStateValue(key, state)
    } catch(e) {
      console.log(e)
    }

    // remove setState from listener on component unmount
    return () => {
      listeners[key].filter(listener => listener !== setState)
    }
  }, [state])

  return [state, setState]
}

const getLocalState = () => {
  const localState = localStorage.getItem('localState')
  return localState ? { ...JSON.parse(localState) } : {}
}

function setLocalStateValue<T>(key: string, value: T) {
  // update all state listeners before setting in case we cannot set localStorage
  // (e.g. private browsing iOS Safari)
  listeners[key].forEach(setState => (setState as React.Dispatch<React.SetStateAction<T>>)(value))

  // set localStorage
  return localStorage.setItem('localState', JSON.stringify({ ...getLocalState(), [key]: value }))
}

export { useLocalState }