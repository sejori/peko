import { getDevSocket } from "./devsocket.js"
import { getPageRoutes } from "./pages.js"
import { getSrcRoutes } from "./src.js"

const getRoutes = async () => {

    return [
        ...await getDevSocket(),
        ...await getPageRoutes(),
        ...await getSrcRoutes()
    ]
}

export default getRoutes