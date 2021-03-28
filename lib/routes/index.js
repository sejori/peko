import { getPageRoutes } from "./pages.js"
import { getStaticRoutes } from "./static.js"

const getRoutes = async () => [
    ...await getPageRoutes(),
    ...await getStaticRoutes()
]

export default getRoutes