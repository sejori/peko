import { devMode } from "../utils/config.js"
import { devSocket } from "../middlewares/devsocket.js"

export const getDevSocket = () => devMode 
    ?   [
            {
                method: 'GET',
                url: "/devsocket",
                middleware: devSocket
            }
        ] 
    :   []
