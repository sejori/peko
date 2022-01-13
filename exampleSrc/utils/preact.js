import { h, hydrate as preactHydrate } from "https://cdn.skypack.dev/preact"
import htm from "https://cdn.skypack.dev/htm"

import { useClient } from "./client.js"

const html = htm.bind(h)
export { html }

export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
