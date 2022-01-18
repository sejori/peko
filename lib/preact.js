import { createElement, hydrate as preactHydrate } from "https://jspm.dev/preact@10.6.4/"
import { useState, useEffect } from "https://jspm.dev/preact@10.6.4/hooks"
import htm from "https://jspm.dev/htm@3.1.0/preact"

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
export const html = htm.bind(createElement)
export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
