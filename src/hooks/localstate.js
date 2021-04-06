import { useState, useEffect } from "/preact/hooks"

// This hook will create a state variable and record it's value
// to localStorage anytime it is set.
//
// The provided value is used for initialization if there is no 
// existing value for matching key in localStorage.
//
// The provided value will also be used in the server-side render
// therefore making it the initial state on load.

const useLocalState = (name, value) => {
    // return regular state if no localStorage (server-side renders)
    if (typeof localStorage === "undefined") return useState(value)

    let localState = localStorage.getItem(name)

    const [state, setState] = useState(localState ? JSON.parse(localState) : value)

    useEffect(() => {
        localStorage.setItem(name, JSON.stringify(state))
    }, [state])

    return [state, setState]
}

export { useLocalState }