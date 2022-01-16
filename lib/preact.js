import { h, hydrate as preactHydrate } from "https://cdn.skypack.dev/preact"
import htm from "https://cdn.skypack.dev/htm"

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

const html = htm.bind(h)
export { html }

export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
