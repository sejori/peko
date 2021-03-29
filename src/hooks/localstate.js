import { useState, useEffect } from "https://cdn.skypack.dev/preact/hooks"

const useLocalState = (name, value) => {
    const [state, setState] = useState(value)

    // return early if no localStorage (server-side renders)
    if (typeof localStorage === "undefined") return [state, setState]

    useEffect(() => {
        localStorage.setItem(name, state)
    }, [state])

    return [state, setState]
}

export { useLocalState }