import { render as preactRender, html, useState, useEffect } from "https://jspm.dev/htm@3.1.0/preact/standalone.module.js"
export { html, useState, useEffect }
export const useClient = (callback, fallback) => typeof document !== "undefined"
    ? callback()
    : fallback()
export const hydrate = (component) => useClient(() => {
    preactRender(component(), document.querySelector("#root"))
}, component)
