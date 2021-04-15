import { hydrate as preactHydrate } from "https://cdn.skypack.dev/preact"
import { useClient } from "./useClient.js"

export const hydrate = (component) => useClient(() => {
    preactHydrate(component(), document.querySelector("#root"))
}, component)
