import { getPageRoutes } from "./pages.js"
import { getSrcRoutes } from "./src.js"

const getRoutes = async () => [
    ...await getPageRoutes(),
    ...await getSrcRoutes()
]

export default getRoutes