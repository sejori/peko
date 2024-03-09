import { useState, useEffect } from "preact/hooks";

// INITIAL STATE
const initialState: Record<string, unknown> = {
  dataArray: ["Item 0", "Item 1", "Item 2"],
};

// listeners object stores arrays of all state variable setters for each key
const listeners: Record<string, ((x: unknown) => unknown)[]> = {};
Object.keys(initialState).forEach((key) => (listeners[key] = []));

/**
 *
 * @param {string} key state variable name
 * @returns [state, setState]
 */
const useLocalState = (key: string) => {
  // return regular state if no localStorage (server-side renders)
  if (typeof localStorage === "undefined") return useState(initialState[key]);

  const [state, setState] = useState(getLocalStateValue(key));
  listeners[key].push(setState);

  useEffect(() => {
    try {
      setLocalStateValue(key, state);
    } catch (e) {
      console.log(e);
    }

    // remove setState from listener on component unmount
    return () => listeners[key].filter((listener) => listener !== setState);
  }, [state]);

  return [state, setState];
};

/**
 *
 * @returns initialState object with updated values from locally stored state
 */
const getLocalState = () => {
  const localState = localStorage.getItem("localState");
  return localState
    ? { ...initialState, ...JSON.parse(localState) }
    : initialState;
};

/**
 *
 * @param {string} key state variable name
 * @returns {*} state variable value
 */
const getLocalStateValue = (key: string) => {
  const localState = getLocalState();
  if (localState[key]) return localState[key];
  throw new Error(
    `Key "${key}" does not exist in localState. Make sure it is added to initialState in /src/hooks/localstate.js.`
  );
};

/**
 *
 * @param {string} key state variable name
 * @param {*} value state variable value
 */
const setLocalStateValue = (key: string, value: unknown) => {
  // update all state listeners before setting in case we cannot set localStorage
  // (e.g. private browsing iOS Safari)
  listeners[key].forEach((setState) => setState(value));

  // set localStorage
  return localStorage.setItem(
    "localState",
    JSON.stringify({ ...getLocalState(), [key]: value })
  );
};

export { useLocalState };
