import { html, render as preactRender } from "https://unpkg.com/htm/preact/standalone.module.js"

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

export { html }

export const render = (component) => useClient(() => {
    preactRender(component(), document.querySelector("#root"))
}, component)
