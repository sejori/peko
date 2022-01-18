import { html, hydrate as preactHydrate, useState, useEffect } from "https://jspm.dev/htm@3.1.0/preact/standalone.module.js"

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

export { html, useState, useEffect }
export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
