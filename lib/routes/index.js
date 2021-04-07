import { createDevSocket } from "./devsocket.js"
import { createPageRoutes } from "./pages.js"
import { createSrcRoutes } from "./src.js"

const createRoutes = async () => [
    ...await createDevSocket(),
    ...await createPageRoutes(),
    ...await createSrcRoutes()
]

export default createRoutes