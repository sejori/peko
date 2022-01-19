import htm from "https://jspm.dev/htm@3.1.0/preact"
import { createElement, hydrate as preactHydrate } from "https://jspm.dev/preact@10.6.4"
export { useState, useEffect } from "https://jspm.dev/preact@10.6.4/hooks"

export const html = htm.bind(createElement)
export const useClient = (callback, fallback) => typeof document !== "undefined"
    ? callback()
    : fallback
export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
