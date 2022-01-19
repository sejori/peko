import { hydrate as preactHydrate } from "https://unpkg.com/preact@10.6.4/src/render.js"
export { useState, useEffect } from "https://unpkg.com/preact@10.6.4/hooks/src/index.js"
export { html } from "https://jspm.dev/htm@3.1.0/preact"
export const useClient = (callback, fallback) => typeof document !== "undefined"
    ? callback()
    : fallback()
export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
