import htm from "https://jspm.dev/htm@3.1.0"
import React from "https://jspm.dev/react@17.0.2"
import ReactDOM from "https://jspm.dev/react-dom@17.0.2"

/**
 * 
 * @param {*} callback function to be called if running client-side
 * @param {*} fallback fallback to return if running server-side
 * @returns callback result or fallback
 */
export const useClient = (callback, fallback) => {
    if (typeof document !== "undefined") {
        return callback()
    }
    return fallback
}

export const html = htm.bind(React.createElement)
export const hydrate = (component) => useClient(() => {
    ReactDOM.hydrate(component(), document.querySelector("#root"))
}, component)
