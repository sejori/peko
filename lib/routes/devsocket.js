import { devMode } from "../../config.js"
import { devSocket } from "../middlewares/devsocket.js"

export const createDevSocket = () => devMode 
    ?   [
            {
                method: 'GET',
                url: "/devsocket",
                middleware: devSocket
            }
        ] 
    :   []
