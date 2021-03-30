import { getPageRoutes } from "./pages.js"
import { getSrcRoutes } from "./src.js"

const getRoutes = async (ENVIRONMENT) => [
    ...await getPageRoutes(ENVIRONMENT),
    ...await getSrcRoutes(ENVIRONMENT)
]

export default getRoutes